"use client"

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import ErrorState from "@/components/error-state";
import Loading from "@/components/loading-state";
export const MeetingView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

    return (
        <div>
            {JSON.stringify(data)}
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
