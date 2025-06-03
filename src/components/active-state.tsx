import React from 'react';
import Link from 'next/link';
import EmptyState from './empty-state';
import { Button } from './ui/button';
import { BanIcon, VideoIcon } from 'lucide-react';

interface Props {
  meetingId: string;
}

const ActiveState = ({ meetingId }: Props) => {
  return (
    <div className="bg-blue-950 text-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        image="/upcoming.svg"
        title="Meeting is Active"
        description="Meeting will end once all participants have left"
      />
      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
        <Button
          asChild
          className="text-white font-bold rounded-lg bg-red-700 hover:bg-red-800"
        >
          <Link href={`/call/${meetingId}`} className="flex items-center gap-2">
            <VideoIcon className="mr-2" />
            Join Meeting
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ActiveState;
