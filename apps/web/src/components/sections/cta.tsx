// @ts-nocheck
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";

import { SanityButtons } from "../sanity-buttons";
import { RichText } from "../richtext";
import type { Cta as CtaType } from "@/lib/sanity/sanity.types";

interface CtaProps {
  data?: CtaType;
  className?: string;
}

export function Cta({ data, className }: CtaProps) {
  if (!data) return null;

  const { eyebrow, title, richText, buttons } = data;

  return (
    <section className={cn("py-24", className)}>
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow && (
            <Badge variant="secondary" className="mb-4">
              {eyebrow}
            </Badge>
          )}
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            {title}
          </h2>
          <div className="text-lg text-muted-foreground">
            {richText && <RichText richText={richText} className="text-balance" />}
          </div>
          <div className="flex justify-center">
            {buttons && <SanityButtons buttons={buttons} />}
          </div>
        </div>
      </div>
    </section>
  );
}

