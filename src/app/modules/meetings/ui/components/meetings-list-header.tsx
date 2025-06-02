"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewMeetingdialog } from "./new-meeting-dialog";
import { useState } from "react";

export const MeetingListHeader = () => {
    const [isDialogOpen, setisDialogOpen] = useState(false)
  return (
    <>
    <NewMeetingdialog 
    open={isDialogOpen}
    onOpenChange={setisDialogOpen}
    />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-2xl">My Meetings</h5>
          <Button onClick={()=>setisDialogOpen(true)} className="bg-red-700 text-white font-bold hover:bg-red-800 rounded-sm">
            <PlusIcon />
            New Meeting
          </Button>
        </div>
        <div className="flex items-center gap-x-2 p-1">

        </div>
      </div>
    </>
  );
};
