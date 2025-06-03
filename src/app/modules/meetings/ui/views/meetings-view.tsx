"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import ErrorState from "@/components/error-state";
import Loading from "@/components/loading-state";
import { DataTable } from "../components/data-table";
import { columns } from "../components/column";
import { useRouter } from "next/navigation";
import { useMeetingsFilters } from "../../hooks/use-meetings-filter";
import DataPagination from "@/components/data-pagination";
import { meetings } from "@/db/schema";
export const MeetingView = () => {
  const trpc = useTRPC();
  const [filters, setfilters] = useMeetingsFilters();
  const router = useRouter();
  const { data } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({
      ...filters,
    })
  );
  return (
    <div className="overflow-x-clip">
      <DataTable 
      data={data.items} 
      columns={columns} 
      onRowClick={(row)=>router.push(`/meeting/${row.id}`)} 
      />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setfilters({ page })}
      />
    </div>
  );
};

export const MeetingsViewLoading = () => {
  return (
    <Loading
      title="Loading Meetings"
      description="This may take a few seconds"
    />
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
