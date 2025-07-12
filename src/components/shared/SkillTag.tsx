

import type { Skill } from "@/lib/types";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Link as LinkIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface SkillTagProps extends BadgeProps {
  skill: Skill;
}

const ensureAbsoluteUrl = (url: string) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};


export function SkillTag({ skill, variant, ...props }: SkillTagProps) {
  const content = (
    <div className="flex items-center gap-1.5">
      {skill.name}
      {skill.referenceUrl && (
        <LinkIcon className="h-3 w-3 text-current opacity-70" />
      )}
    </div>
  );

  if (skill.referenceUrl) {
    const absoluteUrl = ensureAbsoluteUrl(skill.referenceUrl);
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <a href={absoluteUrl} target="_blank" rel="noopener noreferrer" className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full">
            <Badge variant={variant} {...props} className="cursor-pointer">
              {content}
            </Badge>
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>{skill.referenceUrl}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Badge variant={variant} {...props}>
      {content}
    </Badge>
  );
}
