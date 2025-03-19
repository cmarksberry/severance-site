import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextReactComponents,
} from "next-sanity";

import { parseChildrenToSlug } from "@/utils";

import { SanityImage } from "./sanity-image";
import { RichText as RichTextType } from "@/lib/sanity/sanity.types";

const components: Partial<PortableTextReactComponents> = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold mb-4">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-bold mb-4">{children}</h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-lg font-bold mb-4">{children}</h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-base font-bold mb-4">{children}</h6>
    ),
    normal: ({ children }) => (
      <p className="mb-4">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      if (!value?.href) return null;
      return (
        <Link href={value.href} className="text-blue-600 hover:underline">
          {children}
        </Link>
      );
    },
    customLink: ({ value, children }) => {
      if (!value?.href) return null;
      const { href, openInNewTab } = value;
      return (
        <Link href={href} className="text-blue-600 hover:underline" target={openInNewTab ? "_blank" : undefined} rel={openInNewTab ? "noopener noreferrer" : undefined}>
          {children}
        </Link>
      );
    },
    employeeReference: ({ value, children }) => {
      if (!value?.employee?._ref) {
        return <span className="text-red-500">Employee Reference Broken</span>;
      }
      return (
        <Link href={`/team/${value.employee._ref}`} className="text-blue-600 hover:underline">
          {children}
        </Link>
      );
    },
    newsReference: ({ value, children }) => {
      if (!value?.news?._ref || !value?.news?.slug) {
        return <span className="text-red-500">News Reference Broken</span>;
      }
      return (
        <Link href={`/news/${value.news.slug}`} className="text-blue-600 hover:underline">
          {children}
        </Link>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-4">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside mb-4">{children}</ol>
    ),
  },
  types: {
    image: ({ value }) => (
      <div className="my-4">
        <SanityImage
          asset={value}
          className="w-full h-auto rounded-lg"
          width={1600}
          height={900}
        />
      </div>
    ),
  },
  hardBreak: () => <br />,
};

interface RichTextProps {
  richText: RichTextType;
  className?: string;
}

export function RichText({ richText, className = "" }: RichTextProps) {
  if (!richText) return null;
  return <PortableText value={richText} components={components} />;
}
