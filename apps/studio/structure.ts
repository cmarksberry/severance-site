import {
  BookOpen,
  CalendarIcon,
  CogIcon,
  File,
  HomeIcon,
  type LucideIcon,
  MessageCircleQuestion,
  NewspaperIcon,
  PanelBottomIcon,
  PanelTopDashedIcon,
  Settings2,
  User,
} from "lucide-react";
import type {
  StructureBuilder,
  StructureResolverContext,
} from "sanity/structure";

import type { SchemaType, SingletonType } from "./schemaTypes";
import { getTitleCase } from "./utils/helper";

type Base<T = SchemaType> = {
  id?: string;
  type: T;
  preview?: boolean;
  title?: string;
  icon?: LucideIcon;
};

type CreateSingleTon = {
  S: StructureBuilder;
} & Base<SingletonType>;

const createSingleTon = ({ S, type, title, icon }: CreateSingleTon) => {
  const newTitle = title ?? getTitleCase(type);
  return S.listItem()
    .title(newTitle)
    .icon(icon ?? File)
    .child(S.document().schemaType(type).documentId(type));
};

type CreateList = {
  S: StructureBuilder;
} & Base;

const createList = ({ S, type, icon, title, id }: CreateList) => {
  const newTitle = title ?? getTitleCase(type);
  return S.documentTypeListItem(type)
    .id(id ?? type)
    .title(newTitle)
    .icon(icon ?? File);
};

export const structure = (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  return S.list()
    .title("Content")
    .items([
      createSingleTon({ S, type: "homePage", icon: HomeIcon }),
      S.divider(),
      createList({
        S,
        type: "news",
        title: "Lumon News",
        icon: NewspaperIcon,
      }),
      createList({
        S,
        type: "author",
        title: "Lumon Employees",
        icon: User,
      }),
      createList({ S, type: "page", title: "Landing Pages" }),
      createList({
        S,
        type: "event",
        title: "Events & Celebrations",
        icon: CalendarIcon,
      }),
      S.listItem()
        .title("Kier's Knowledge")
        .icon(BookOpen)
        .schemaType("kierKnowledge")
        .child(
          S.documentList()
            .title("Kier's Knowledge")
            .schemaType("kierKnowledge")
            .filter('_type == "kierKnowledge"'),
        ),
      S.divider(),
      createList({
        S,
        type: "faq",
        title: "FAQs",
        icon: MessageCircleQuestion,
      }),
      S.listItem()
        .title("Site Configuration")
        .icon(Settings2)
        .child(
          S.list()
            .title("Site Configuration")
            .items([
              createSingleTon({
                S,
                type: "navbar",
                title: "Navigation",
                icon: PanelTopDashedIcon,
              }),
              createSingleTon({
                S,
                type: "footer",
                title: "Footer",
                icon: PanelBottomIcon,
              }),
              createSingleTon({
                S,
                type: "settings",
                title: "Global Settings",
                icon: CogIcon,
              }),
            ]),
        ),
    ]);
};
