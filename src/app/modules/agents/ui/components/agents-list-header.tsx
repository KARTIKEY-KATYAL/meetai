"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { NewAgentdialog } from "./new-agent-dialog";
import { useState } from "react";
import { useAgentsFilters } from "../../hooks/use-agents-filter";
import { AgentSearchFilter } from "./agents-search-filter";
import { DEFAULT_PAGE } from "@/constants";

export const ListHeader = () => {
  const [filters , setfilters] = useAgentsFilters()
  const [isDialogOpen, setisDialogOpen] = useState(false);

  const isAnyFilterModified = !!filters.search

  const onClearFilters = () =>{
    setfilters({
      search:"",
      page:DEFAULT_PAGE
    })

  }
  return (
    <>
      <NewAgentdialog open={isDialogOpen} onOpenChange={setisDialogOpen} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-2xl">My Agents</h5>
          <Button onClick={()=>setisDialogOpen(true)} className="bg-red-700 text-white font-bold hover:bg-red-800 rounded-sm">
            <PlusIcon />
            New Agent
          </Button>
        </div>
        <div className="flex items-center gap-x-2 p-1">
          <AgentSearchFilter/>
          {isAnyFilterModified &&(
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              <XCircleIcon/>
              Clear
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
