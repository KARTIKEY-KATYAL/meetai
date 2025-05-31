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
import { useAgentsFilters } from "../../hooks/use-agents-filter";
import { agents } from "@/db/schema";
import DataPagination from "../components/data-pagination";
import { useRouter } from "next/navigation";

export const AgentsView = () => {
  const router = useRouter()
  const[filters,setfilters] = useAgentsFilters()
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
    ...filters
  }));
  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable 
        data={data.items} 
        columns={columns} 
        onRowClick={(row)=>router.push(`/agents/${row.id}`)}
        />
      <DataPagination
      page={filters.page}
      totalPages = {data.totalPages}
      onPageChange = {(page)=>setfilters({page})}
      />
      {data.items.length === 0 && (
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
