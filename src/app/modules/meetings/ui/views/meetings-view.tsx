"use client"

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import ErrorState from "@/components/error-state";
import Loading from "@/components/loading-state";
import { DataTable } from "../components/data-table";
import { columns } from "../components/column";
export const MeetingView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

    return (
        <div className="overflow-x-clip">
            <DataTable data = {data.items} columns={columns}/>
        </div>
    );
};

export const MeetingsViewLoading = () => {
  return (
    <Loading title="Loading Meetings" description="This may take a few seconds" />
  );
};

export const MeetingsViewError = () => {
  return (
    <ErrorState
      title="Error Loading Meetings"
      description="Something Went Wrong"
    />
  );
};
