"use client"

import ErrorState from "@/components/error-state"
import Loading from "@/components/loading-state"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { MeetingIdViewHeader } from "../components/meeting-id-view-header"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useConfrim } from "@/hooks/use-confrim"
import { UpdateMeetingdialog } from "../components/update-meeting-dialog"
import { useState } from "react"
import { meetings } from "@/db/schema"
import UpcomingState from "@/components/upcoming-state"
import ActiveState from "@/components/active-state"
import CancelledState from "@/components/cancellled-state"
import ProcessingState from "@/components/processing-state"
import CompletedState from "../components/CompletedState"

interface Props {
    meetingId : string
}

export const MeetingIdView = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter()
  const queryClient = useQueryClient()
  const [updateMeetingDialogOpen, setupdateMeetingDialogOpen] = useState(false)

  const [RemoveConfrimation,confrimRemove] = useConfrim(
    "Are You Sure ?",
    "The following action will remove the meeting"
  )

  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}))
        router.push("/meetings")
      }
    })
  )

  const handleRemove = async () =>{
    const ok = await confrimRemove()
    if (!ok){
      return
    }
    await removeMeeting.mutateAsync({id : meetingId})
  }

  const isActive = data.status === "active"
  const isUpcoming = data.status === "upcoming"
  const isCancelled = data.status === "cancelled"
  const isCompleted = data.status === "completed"
  const isProcessing = data.status === "processing"


  return (
    <>
    <RemoveConfrimation/>
    <UpdateMeetingdialog
    open = {updateMeetingDialogOpen}
    onOpenChange={setupdateMeetingDialogOpen}
    initialValues={data}
    />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <MeetingIdViewHeader
          meetingid={meetingId}
          meetingName={data.name} 
          onEdit={async () => setupdateMeetingDialogOpen(true)}
          onRemove={handleRemove}
        />
        {isCancelled && <CancelledState/>}
        {isProcessing && <ProcessingState/>}
        {isCompleted && <CompletedState data={data}/>}
        {isActive && <ActiveState meetingId={meetingId} / > }
        {isUpcoming && <UpcomingState
        meetingId={meetingId}
        onCancelMeeting={()=>{}}
        isCancelling={false}
        />}
      </div>
    </>
  );
};

export const MeetingIdViewLoading = () => {
  return (
    <Loading
      title="Loading Meeting"
      description="This may take a few seconds"
    />
  );
};

export const MeetingIdViewError = () => {
  return (
    <ErrorState
      title="Error Loading Meeting"
      description="Something Went Wrong"
    />
  );
};
