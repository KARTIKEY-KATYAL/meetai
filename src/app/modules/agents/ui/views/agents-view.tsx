"use client";

import ErrorState from "@/components/error-state";
import Loading from "@/components/loading-state";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";

export const AgentsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return (
    <div>
      <ResponsiveDialog 
      title="Responsive Test"
      description="Responsive Description"
      open={false}
      onOpenChange={() => {}}
      >
        <Button>
          Some Actions
        </Button>
      </ResponsiveDialog>
      {JSON.stringify(data, null, 2)}
    </div>
  );
};

export const AgentsViewLoading = () => {
  return (
    <Loading title="Loading Agents" description="This may take a few seconds" />
  );
};

export const AgentsViewError = () => {
  return (
    <ErrorState
      title="Error Loading Agents"
      description="Something Went Wrong"
    />
  );
};
