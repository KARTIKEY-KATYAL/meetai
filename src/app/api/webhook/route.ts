import {
    CallEndedEvent,
    CallTranscriptionReadyEvent,
    CallSessionParticipantLeftEvent,
    CallRecordingReadyEvent,
    CallSessionStartedEvent
} from "@stream-io/video-react-sdk"
import { and, eq, not } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { agents, meetings } from "@/db/schema"
import { streamVideo } from "@/lib/stream-video"
import { error } from "console"
import { unknown } from "zod"
import { db } from "@/db"
import { inngest } from "@/inngest/client"

function verifysignatureWithSDK(body: string, signature: string): boolean {
    return streamVideo.verifyWebhook(body, signature)
}

export async function POST(req: NextRequest) {
    const signature = req.headers.get("x-signature")
    const apiKey = req.headers.get("x-api-key")

    if (!signature || !apiKey) {
        return NextResponse.json(
            { error: "Missing Signature or ApiKey" },
            { status: 400 }
        )
    }

    const body = await req.text()

    if (!verifysignatureWithSDK(body, signature)) {
        return NextResponse.json({ error: "Invalid Signature" }, { status: 401 })
    }

    let payload: unknown
    try {
        payload = JSON.parse(body) as Record<string, unknown>
    } catch (error) {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const eventType = (payload as Record<string, unknown>)?.type

    if (eventType == "call.session_started") {
        const event = payload as CallSessionStartedEvent;
        const meetingId = event.call.custom?.meetingId
        if (!meetingId) {
            return NextResponse.json({ error: "Missing MeetingId" }, { status: 400 })
        }

        const [existingmeeting] = await db
            .select()
            .from(meetings)
            .where(
                and(
                    eq(meetingId, meetings.id),
                    not(eq(meetings.status, "completed")),
                    not(eq(meetings.status, "active")),
                    not(eq(meetings.status, "cancelled")),
                    not(eq(meetings.status, "processing")),
                )
            )
        if (!existingmeeting) {
            return NextResponse.json({ error: "Meeting Not Found" }, { status: 404 })
        }

        await db
            .update(meetings)
            .set({
                status: "active",
                started_At: new Date()
            })
            .where(eq(meetings.id, existingmeeting.id))

        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, existingmeeting.agentId))
        if (!existingAgent) {
            return NextResponse.json({ error: "Agent Not Found" }, { status: 404 })
        }

        const call = streamVideo.video.call("default", meetingId)

        const realtimeClient = await streamVideo.video.connectOpenAi({
            call,
            openAiApiKey: process.env.OPENAI_API_KEY!,
            agentUserId: existingAgent.id
        })

        realtimeClient.updateSession({
            instructions: existingAgent.instructions
        })
    } else if (eventType === "call.session_participant_left") {
        const event = payload as CallSessionParticipantLeftEvent
        const meetingId = event.call_cid.split(":")[1]

        if (!meetingId) {
            return NextResponse.json({ error: "Missing MeetingId" }, { status: 400 })
        }

        const call = streamVideo.video.call("default", meetingId)

        await call.end()
    } else if (eventType === "call.session_ended") {
        const event = payload as CallEndedEvent
        const meetingId = event.call.custom?.meetingId

        if (!meetingId) {
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 })
        }

        await db
            .update(meetings)
            .set({
                status: "processing",
                ended_At: new Date()
            })
            .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")))
    } else if (eventType === "call.transcription_ready") {
        const event = payload as CallTranscriptionReadyEvent
        const meetingId = event.call_cid.split(":")[1]

        const [updatedMeeting] = await db
            .update(meetings)
            .set({
                transcriptUrl: event.call_transcription.url
            })
            .where(eq(meetings.id, meetingId))
            .returning()

        if (!updatedMeeting) {
            return NextResponse.json({ error: "Missing Meeting" }, { status: 404 })
        }

        await inngest.send({
            name:"meetings/processing",
            data:{
                meetingId:updatedMeeting.id,
                transcriptUrl:updatedMeeting.transcriptUrl
            }
        })
    } else if (eventType === "call.recording_ready") {
        const event = payload as CallRecordingReadyEvent
        const meetingId = event.call_cid.split(":")[1]

        await db
            .update(meetings)
            .set({ recordingUrl: event.call_recording.url })
            .where(eq(meetings.id, meetingId))

    }

    return NextResponse.json({ status: 'Ok' })
}