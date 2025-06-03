"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon , XCircleIcon } from "lucide-react";
import { NewMeetingdialog } from "./new-meeting-dialog";
import { useState } from "react";
import { MeetingsSearchFilter } from "./meetings-search-filter";
import { StatusFilters } from "./status-filter";
import { AgentIdFilter } from "./agent-id-filter";
import { useMeetingsFilters } from "../../hooks/use-meetings-filter";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";

export const MeetingListHeader = () => {
  const [filters,setfilters] = useMeetingsFilters()
  const [isDialogOpen, setisDialogOpen] = useState(false)

  const isAnyFilterModified = 
        !!filters.status || !!filters.search || !!filters.agentId
  
  const onClearFilters = () => {
    setfilters({
      status: null,
      agentId: "",
      search: "",
      page: 1
    })
  }

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
        <ScrollArea>
        <div className="flex items-center gap-x-2 p-1">
          <MeetingsSearchFilter/>
          <StatusFilters/>
          <AgentIdFilter/>
          {isAnyFilterModified && (
            <Button variant="outline" onClick={onClearFilters}>
              <XCircleIcon className="size-4"/>
              Clear
            </Button>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};
