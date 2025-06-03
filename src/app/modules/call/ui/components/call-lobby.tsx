interface Props {
  onJoin: () => void;
}

import { LogInIcon } from "lucide-react";
import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { GenerateAvatarUri } from "@/lib/avatar";
import Link from "next/link";

export const CallLobby = ({ onJoin }: Props) => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();

  const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
  const { hasBrowserPermission: hasCameraPermission } = useCameraState();

  const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission;

  const DisabledVideoPreview = () => {
    const { data } = authClient.useSession();

    return (
      <DefaultVideoPlaceholder
        participant={
          {
            name: data?.user.name ?? "",
            image:
              data?.user.image ??
              GenerateAvatarUri({
                seed: data?.user.name ?? "",
                variant: "initials",
              }),
          } as StreamVideoParticipant
        }
      />
    );
  };

  const AllowBrowserPermissions = () => {
    return (
      <p className="text-sm text-red-500 text-center">
        Please grant your browser permission to access your camera and microphone.
      </p>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
      <div className="py-4 px-8 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
          <div className="flex flex-col gap-y-2 text-center">
            <h6 className="text-lg font-medium">Ready to Join?</h6>
            <p className="text-sm">Set up your call before joining</p>
          </div>

          <VideoPreview
            DisabledVideoPreview={
              hasBrowserMediaPermission ? DisabledVideoPreview : AllowBrowserPermissions
            }
          />

          <div className="flex gap-x-2">
            <ToggleAudioPreviewButton aria-label="Toggle microphone" />
            <ToggleVideoPreviewButton aria-label="Toggle camera" />
          </div>

          <div className="flex gap-x-2 justify-center w-full mt-4">
            <Button className="bg-red-700 text-white font-bold rounded-lg hover:bg-red-800" asChild>
              <Link href="/meetings">Cancel</Link>
            </Button>
            <Button onClick={onJoin} className="bg-blue-800 text-white font-bold rounded-lg hover:bg-blue-950" disabled={!hasBrowserMediaPermission}>
              <LogInIcon className="mr-2 h-4 w-4" />
              Join Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
