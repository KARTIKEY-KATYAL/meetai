import { useTRPC } from "@/trpc/client"
import { useMeetingsFilters } from "../../hooks/use-meetings-filter"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { agents } from "@/db/schema"
import { CommandSelect } from "@/components/command-select"
import { GeneratedAvatar } from "@/components/generated-avatar"

export const AgentIdFilter = () => {
    const [filters , setfilters] = useMeetingsFilters()
    const trpc = useTRPC()
    const [agentSearch , setagentSearch] = useState("")
    const {data} = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize:100,
            search:agentSearch
        })
    )

    return(
        <CommandSelect
        className="h-9"
        placeholder="Agents"
        options={(data?.items ?? []).map((agents)=>({
            id:agents.id,
            value:agents.id,
            children:(
                <div className="flex items-center gap-x-2">
                    <GeneratedAvatar
                    seed={agents.name}
                    variant="botttsNeutral"
                    className="size-4"
                    />
                    {agents.name}
                </div>
            )
        }))}
        onSelect={(value)=>setfilters({agentId:value})}
        onSearch={setagentSearch}
        value={filters.agentId ?? ""}
        />
    )
}