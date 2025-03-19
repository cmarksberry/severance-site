// @ts-nocheck
import { cn } from "@workspace/ui/lib/utils";

import { SanityImage } from "../sanity-image";
import type { FeatureCardsIcon } from "@/lib/sanity/sanity.types";

interface FeatureCardsWithIconProps {
  data?: FeatureCardsIcon;
  className?: string;
}

export function FeatureCardsWithIcon({ data, className }: FeatureCardsWithIconProps) {
  if (!data) return null;

  const { eyebrow, title, cards } = data;

  return (
    <section className={cn("py-24", className)}>
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow && (
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              {title}
            </h2>
          )}
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards?.map((card) => {
            const employee = card.employee;
            if (!employee) return null;
            
            return (
              <div
                key={card._key}
                className="relative flex flex-col items-center text-center"
              >
                <div className="mb-4 h-16 w-16 overflow-hidden rounded-full">
                  <SanityImage
                    asset={employee.image || null}
                    alt={employee.name || "Employee"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold">{employee.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {employee.department}
                </p>
                {card.highlight && (
                  <p className="mt-4 text-sm font-medium text-primary">
                    {card.highlight}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
