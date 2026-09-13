import { Download, Heart, MoreHoriz, ShareAndroid } from "iconoir-react";
import { MenuAction } from "@/shared/ui/MenuAction";
import Heading from "@/shared/ui/Heading";
import type { ApiProgressionResponse } from "@/types/api";

interface ProgressionCardProps {
  progression: ApiProgressionResponse;
}

export const ProgressionCard = ({ progression }: ProgressionCardProps) => {
  return (
    <div className="flex flex-col justify-between gap-8 rounded-2xl border border-stroke-subtle bg-ui-card p-5">
      <div>
        <Heading level={4}>{progression.title}</Heading>
        <p className="text-label font-medium text-content-muted">
          {new Date(progression.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="flex justify-between">
        <div className="flex items-center -ml-3 gap-2">
          <MenuAction variants={{}} icon={<Download strokeWidth={2} />} />
          <MenuAction variants={{}} icon={<ShareAndroid strokeWidth={2} />} />
          <MenuAction variants={{}} icon={<Heart strokeWidth={2} />} />
        </div>
        <div className="flex items-center -ml-3">
          <MenuAction variants={{}} icon={<MoreHoriz strokeWidth={2} />} />
        </div>
      </div>
    </div>
  );
};
