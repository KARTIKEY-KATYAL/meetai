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

    let payload : unknown
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
                                            eq(meetingId,meetings.id),
                                            not(eq(meetings.status,"completed")),
                                            not(eq(meetings.status,"active")),
                                            not(eq(meetings.status,"cancelled")),
                                            not(eq(meetings.status,"processing")),
                                        )
                                    )
        if (!existingmeeting){
            return NextResponse.json({error:"Meeting Not Found"},{status:404})
        }

        await db
                .update(meetings)
                .set({
                    status:"active",
                    started_At:new Date()
                })
                .where(eq(meetings.id,existingmeeting.id))
        
        const [existingAgent] = await db
                                    .select()
                                    .from(agents)
                                    .where(eq(agents.id,existingmeeting.agentId))
        if (!existingAgent){
            return NextResponse.json({error:"Agent Not Found"},{status:404})
        }

        const call = streamVideo.video.call("default",meetingId)

        const realtimeClient = await streamVideo.video.connectOpenAi({
            call,
            openAiApiKey: process.env.OPENAI_API_KEY!,
            agentUserId: existingAgent.id
        })

        realtimeClient.updateSession({
            instructions:existingAgent.instructions
        })
    } else if (eventType === "call.session_participant_left"){
        const event = payload as CallSessionParticipantLeftEvent
        const meetingId = event.call_cid.split(":")[1]

        if (!meetingId){
            return NextResponse.json({error:"Missing MeetingId"},{status:400})
        }

        const call = streamVideo.video.call("default",meetingId)

        await call.end()
    }

    return NextResponse.json({ status: 'Ok' })
}