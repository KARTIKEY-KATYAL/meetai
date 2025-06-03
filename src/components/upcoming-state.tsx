import React from 'react';
import Link from 'next/link';
import EmptyState from './empty-state';
import { Button } from './ui/button';
import { BanIcon, VideoIcon } from 'lucide-react';

interface Props {
  meetingId: string;
  onCancelMeeting: () => void;
  isCancelling: boolean;
}

const UpcomingState = ({ meetingId, onCancelMeeting, isCancelling }: Props) => {
  return (
    <div className="bg-blue-950 text-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        image="/upcoming.svg"
        title="Not Started Yet"
        description="Once you start this meeting, a summary will appear here."
      />
      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
        <Button
          className="text-white font-bold rounded-lg bg-slate-700 hover:bg-slate-950"
          onClick={onCancelMeeting}
          disabled={isCancelling}
        >
          <BanIcon className="mr-2" />
          Cancel Meeting
        </Button>
        <Button
          asChild
          className="text-white font-bold rounded-lg bg-red-700 hover:bg-red-800"
          disabled={isCancelling}
        >
          <Link href={`/call/${meetingId}`} className="flex items-center gap-2">
            <VideoIcon className="mr-2" />
            Start Meeting
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default UpcomingState;
