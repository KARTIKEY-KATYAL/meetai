"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewAgentdialog } from "./new-agent-dialog";
import { useState } from "react";

export const ListHeader = () => {
  const [isDialogOpen, setisDialogOpen] = useState(false);
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
      </div>
    </>
  );
};
