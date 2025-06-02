"use client";

import ErrorState from "@/components/error-state";
import Loading from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { AgentIdViewHeader } from "../components/agent-id-view";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfrim } from "@/hooks/use-confrim";
import { useState } from "react";
import { UpdateAgentdialog } from "../components/update-agent-dialog";

interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );

  const [updateAgentDialogOpen, setupdateAgentDialogOpen] = useState(false)

  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
        router.push('/agents');
        toast.success("Agent deleted successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      }
    })
  );

  const [RemoveConfirmation, confirmRemove] = useConfrim(
    "Are you sure?",
    `This action will permanently delete the agent and remove ${data.meetingCount} associated meetings. This cannot be undone.`
  );

  const handleRemoveAgent = async () => {
    const ok = await confirmRemove();

    if (!ok) {
      return;
    }

    await removeAgent.mutateAsync({ id: agentId });
  };

  return (
    <>
      <RemoveConfirmation />
      <UpdateAgentdialog 
        open={updateAgentDialogOpen}
        onOpenChange={setupdateAgentDialogOpen}
        initialValues={data}
      />
      <div className="flex-1 py-6 px-4 md:px-8 flex flex-col gap-y-6">
        <AgentIdViewHeader
          agentid={agentId}
          agentName={data.name}
          onEdit={() => setupdateAgentDialogOpen(true)}
          onRemove={handleRemoveAgent}
        />
        
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Agent Header */}
            <div className="flex items-start gap-4">
              <GeneratedAvatar
                variant="botttsNeutral"
                seed={data.name}
                className="size-16 ring-2 ring-primary/20"
              />
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {data.name}
                  </h2>
                  <Badge 
                    variant="outline" 
                    className="mt-2 flex items-center gap-2 w-fit bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800"
                  >
                    <VideoIcon className="size-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-700 dark:text-blue-300">
                      {data.meetingCount} {data.meetingCount === 1 ? "meeting" : "meetings"}
                    </span>
                  </Badge>
                </div>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h3 className="text-lg font-semibold text-foreground">
                Instructions
              </h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-muted-foreground leading-relaxed">
                  {data.instructions}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const AgentIdViewLoading = () => {
  return (
    <Loading 
      title="Loading Agent" 
      description="This may take a few seconds" 
    />
  );
};

export const AgentIdViewError = () => {
  return (
    <ErrorState
      title="Error Loading Agent"
      description="Something went wrong. Please try again."
    />
  );
};
