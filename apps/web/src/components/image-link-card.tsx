// @ts-nocheck
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";

import type { PagebuilderType } from "../types";
import { SanityImage } from "./sanity-image";

type CardLink = {
  text: string;
  href: string;
};

export type CTACardProps = {
  card: NonNullable<PagebuilderType<"imageLinkCards">["cards"]>[number] & {
    link?: CardLink;
  };
  className?: string;
};

export function CTACard({ card, className }: CTACardProps) {
  if (!card?.title) return null;

  return (
    <Link
      href={card.link?.href || "#"}
      className={cn(
        "rounded-3xl p-4 md:p-8 transition-colors relative overflow-hidden group flex flex-col justify-end xl:h-[400px]",
        className,
      )}
    >
      {card.image?.asset && (
        <div className="absolute inset-0 z-[1] mix-blend-multiply">
          <SanityImage
            asset={card.image}
            loading="eager"
            priority
            quality={100}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="relative z-[2] text-white">
        <h3 className="text-2xl font-semibold mb-2">{card.title}</h3>
        {card.description && (
          <p className="text-white/80">{card.description}</p>
        )}
        {card.link?.text && (
          <p className="text-white/80 mt-2">{card.link.text}</p>
        )}
      </div>
    </Link>
  );
}
