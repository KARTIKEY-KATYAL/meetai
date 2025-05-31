"use client";

import ErrorState from "@/components/error-state";
import Loading from "@/components/loading-state";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import { DataTable } from "../components/data-table";
import { columns } from "../components/column";
import EmptyState from "@/components/empty-state";

export const AgentsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <ResponsiveDialog
        title="Responsive Test"
        description="Responsive Description"
        open={false}
        onOpenChange={() => {}}
      >
        <Button>Some Actions</Button>
      </ResponsiveDialog>
      <DataTable data={data} columns={columns} />
      {data.length === 0 && (
        <EmptyState
          title="Create your first Agent"
          description="Create an Agent to join your meeting . Each Agent will follow your instructions and can interact with participants in a call"
        />
      )}
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
