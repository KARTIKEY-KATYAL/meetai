import React from "react";
import { MeetingGetOne } from "../../types";
import { Tabs } from "@radix-ui/react-tabs";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpenIcon, BookOpenTextIcon, ClockFadingIcon, FileTextIcon, FileVideoIcon, SparkleIcon, SparklesIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Markdown from "react-markdown"
import Link from "next/link";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { format } from "date-fns";
import { formatduration } from "@/lib/utils";

interface Prop {
  data: MeetingGetOne;
}
const CompletedState = ({ data }: Prop) => {
  return (
    <div className="flex flex-col gap-y-4">
      <Tabs defaultValue="summary">
        <div className="bg-white rounded-lg border px-3">
          <ScrollArea>
            <TabsList className="p-0 bg-background justify-start rounded-lg h-13">
              <TabsTrigger
                value="summary"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <BookOpenTextIcon />
                Summary
              </TabsTrigger>
              <TabsTrigger
                value="transcript"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <FileTextIcon/>
                TranScript
              </TabsTrigger>
              <TabsTrigger
                value="recording"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <FileVideoIcon/>
                Recording
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <SparkleIcon/>
                Ask AI
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <TabsContent value="recording">
            <div className="bg-white rounded-lg border px-4 py-5">
                <video
                src={data.recordingUrl!}
                className="w-full rounded-lg"
                controls
                />
            </div>
        </TabsContent>
        <TabsContent value="summary">
            <div className="bg-white rounded-lg border">
                <div className="flex flex-col px-4 py-5 col-span-5">
                <h2 className="text-2xl font-medium capitalize text-black">{data.name}</h2>
                <div className="flex gap-x-2 items-center">
                    <Link
                    href={`/agents/${data.agent.id}`}
                    className="flex items-center gap-x-2  text-blue-950 font-bold underline underline-offset-4 capitalize"
                    >
                        <GeneratedAvatar
                        seed={data.agent.name}
                        variant="botttsNeutral"
                        className="size-5"
                        />
                        {data.agent.name}
                    </Link>{" "}
                    <p className="text-black">{data.started_At ? format(data.started_At,"PPP"):""}</p>
                </div>
                <div className="flex gap-x-2 items-center">
                    <SparklesIcon className="size-4 text-black"/>
                        <p className="text-black">Generate Summary</p>
                </div>
                <Badge
                    variant="outline"
                    className="flex items-center text-black gap-x-2 [&>svg]:size-4"
                >
                    <ClockFadingIcon className="text-blue-700"/>
                    {data.duration ? formatduration(data.duration) : "No Duration"}
                </Badge>
                </div>
                <div className="text-black">
                    <Markdown
                    components={{
                        h1:(props)=>(
                            <h1 className="text-2xl font-medium mb-6" {...props}/>
                        ),
                        h2:(props)=>(
                            <h1 className="text-xl font-medium mb-6" {...props}/>
                        ),
                        h3:(props)=>(
                            <h1 className="text-lg font-medium mb-6" {...props}/>
                        ),
                        h4:(props)=>(
                            <h1 className="text-base font-medium mb-6" {...props}/>
                        ),
                        p:(props)=>(
                            <p className="mb-6 leading-relaxed" {...props} />
                        ),
                        ul:(props)=>(
                            <ul className="list-disc list-inside mb-6" {...props} />
                        ),
                        ol:(props)=>(
                            <ol className="list-decimal list-inside mb-6" {...props} />
                        ),
                        li:(props)=>(
                            <li className="mb-1" {...props} />
                        ),
                        strong:(props)=>(
                            <strong className="font-semibold" {...props} />
                        ),
                        code:(props)=>(
                            <code 
                            className="bg-gray-100 px-1 py-0.5 rounded"
                            {...props}
                            />
                        ),
                        blockquote:(props)=>(
                            <blockquote 
                            className="border-l-4 pl-4 italic my-4"
                            {...props}
                            />
                        ),

                    }}
                    >
                        {data.summary}
                    </Markdown>
                </div>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompletedState;
