import { SanityImage } from "@/components/sanity-image";
import { cn } from "@/lib/utils";
import { FeatureCardsIcon } from "@/lib/sanity/sanity.types";

interface FeatureCardProps {
  card: NonNullable<FeatureCardsIcon["cards"]>[number];
  className?: string;
}

const FeatureCard = ({ card, className }: FeatureCardProps) => {
  const { employee, highlight } = card;

  if (!employee) return null;

  return (
    <div
      className={cn(
        "flex flex-col items-center text-center",
        className
      )}
    >
      {employee.image && (
        <div className="mb-4 h-16 w-16 overflow-hidden rounded-full">
          <SanityImage
            asset={employee.image}
            alt={employee.name || "Employee"}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold">{employee.name}</h3>
      {highlight && (
        <p className="text-sm text-muted-foreground">{highlight}</p>
      )}
    </div>
  );
};

interface FeatureCardsWithIconProps {
  eyebrow?: string;
  title?: string;
  cards?: FeatureCardsIcon["cards"];
  className?: string;
}

export const FeatureCardsWithIcon = ({
  eyebrow,
  title,
  cards,
  className,
}: FeatureCardsWithIconProps) => {
  if (!cards?.length) return null;

  return (
    <section className={cn("py-16", className)}>
      <div className="container">
        {(eyebrow || title) && (
          <div className="mb-12 text-center">
            {eyebrow && (
              <p className="mb-4 text-sm font-medium text-primary">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {title}
              </h2>
            )}
          </div>
        )}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <FeatureCard key={card._key} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
};
