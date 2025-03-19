import { author } from "./author";
import { event } from "./event";
import { eventMemory } from "./eventMemory";
import { faq } from "./faq";
import { footer } from "./footer";
import { homePage } from "./home-page";
import { kierKnowledge } from "./kierKnowledge";
import { navbar } from "./navbar";
import { news } from "./news";
import { page } from "./page";
import { settings } from "./settings";

export const singletons = [homePage, settings, footer, navbar];

export const documents = [news, page, faq, author, event, eventMemory, kierKnowledge, ...singletons];
