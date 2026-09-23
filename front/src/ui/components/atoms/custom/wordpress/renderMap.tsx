import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/src/ui/components/atoms/shadcnUI/card";
import { Button } from "@/src/ui/components/atoms/shadcnUI/button";
import type { Renderer } from "./types";
import {
    hasAncestorTag,
    hasAncestorWithClassName,
    hasClassName,
    isExternalLink,
    getTextAlignClass,
    toDimension,
} from "./utils";

const HEADING_CLASS = "font-heading font-bold tracking-tight text-foreground";

const HEADING_SIZES: Record<string, string> = {
    h1: "text-3xl md:text-5xl mt-16",
    h2: "text-2xl md:text-4xl mt-12",
    h3: "text-xl md:text-3xl",
    h4: "text-lg md:text-2xl",
    h5: "text-base md:text-xl",
    h6: "text-base",
};

function heading(Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"): Renderer {
    return (({ node, children }) => (
        <Tag className={`${HEADING_CLASS} ${HEADING_SIZES[Tag]} ${getTextAlignClass(node)}`}>{children}</Tag>
    ))
}

/** Blocs qui gèrent déjà leur propre mise en page : l'image doit alors remplir la cellule. */
const SELF_LAYOUT_BLOCKS = [
    "wp-block-media-text",
    "wp-block-gallery",
    "wp-block-columns",
    "wp-block-column",
    "is-layout-grid",
];

const LINK_CLASS = "font-medium text-blue-700 underline underline-offset-4";

/**
 * Registre balise HTML -> composant.
 * Pour restyler un élément, il suffit de modifier son entrée ici ;
 * pour en prendre un nouveau en charge, d'ajouter une clé.
 */
export const renderMap: Record<string, Renderer> = {
    h1: heading("h1"),
    h2: heading("h2"),
    h3: heading("h3"),
    h4: heading("h4"),
    h5: heading("h5"),
    h6: heading("h6"),

    p: ({ node, children }) => (
        <p className={`max-w-none text-base leading-7 md:text-lg ${getTextAlignClass(node) || "text-justify"}`}>
            {children}
        </p>
    ),

    ul: ({ children }) => (
        <div className="w-full">
            <ul className="list-disc space-y-3 pl-6 md:pl-8">{children}</ul>
        </div>
    ),

    ol: ({ children }) => (
        <div className="w-full">
            <ol className="list-decimal space-y-3 pl-6 md:pl-8">{children}</ol>
        </div>
    ),

    li: ({ children }) => <li className="text-base leading-7 md:text-lg">{children}</li>,

    hr: () => <hr className="my-8 border-t-2 border-border" />,

    blockquote: ({ node, children }) => {
        const sizeClass = hasClassName(node, "is-style-large") ? "text-xl md:text-2xl" : "text-base md:text-lg";

        return (
            <blockquote className={`border-l-4 border-black bg-secondary-background px-4 py-3 italic ${sizeClass}`}>
                {children}
            </blockquote>
        );
    },

    pre: ({ children }) => (
        <pre className="overflow-x-auto rounded-base border-2 border-border bg-secondary-background p-4 text-sm leading-6 shadow-shadow">
            {children}
        </pre>
    ),

    // Dans un <pre>, le style « pilule » du code inline ferait doublon avec le bloc parent.
    code: ({ node, children }) =>
        hasAncestorTag(node, "pre") ? (
            <code className="font-mono">{children}</code>
        ) : (
            <code className="rounded-sm bg-secondary-background px-1 py-0.5 font-mono text-sm">{children}</code>
        ),

    table: ({ children }) => (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border-2 border-border">{children}</table>
        </div>
    ),
    thead: ({ children }) => <thead className="bg-main">{children}</thead>,
    tr: ({ children }) => <tr className="border-b-2 border-border">{children}</tr>,
    th: ({ attribs, children }) => (
        <th
            className="border-r-2 border-border px-3 py-2 text-left align-top font-heading text-base md:text-lg"
            colSpan={attribs.colspan ? Number(attribs.colspan) : undefined}
            rowSpan={attribs.rowspan ? Number(attribs.rowspan) : undefined}
            scope={attribs.scope}
        >
            {children}
        </th>
    ),
    td: ({ attribs, children }) => (
        <td
            className="border-r-2 border-border px-3 py-2 align-top text-sm md:text-base"
            colSpan={attribs.colspan ? Number(attribs.colspan) : undefined}
            rowSpan={attribs.rowspan ? Number(attribs.rowspan) : undefined}
        >
            {children}
        </td>
    ),

    figcaption: ({ children }) => <figcaption className="text-sm italic text-neutral-700">{children}</figcaption>,

    figure: ({ children }) => <figure className="my-6 space-y-3">{children}</figure>,

    a: ({ node, attribs, children }) => {
        const href = attribs.href;

        if (!href) {
            return <>{children}</>;
        }

        if (hasClassName(node, "wp-block-button__link")) {
            return (
                <Button asChild className="font-bold">
                    <Link href={href} target={isExternalLink(href) ? "_blank" : undefined} rel={isExternalLink(href) ? "noreferrer noopener" : undefined}>
                        {children}
                    </Link>
                </Button>
            );
        }

        if (isExternalLink(href)) {
            return (
                <a href={href} target="_blank" rel="noreferrer noopener" className={LINK_CLASS}>
                    {children}
                </a>
            );
        }

        return (
            <Link href={href} className={LINK_CLASS}>
                {children}
            </Link>
        );
    },

    img: ({ node, attribs }) => {
        if (!attribs.src) {
            return null;
        }

        const fillsParent = hasAncestorWithClassName(node, SELF_LAYOUT_BLOCKS);

        return (
            <div className={fillsParent ? "w-full" : "w-full px-2 md:px-8"}>
                <Card
                    className={`mx-auto overflow-hidden border-2 p-0 cursor-default hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none ${fillsParent ? "h-full w-full" : "w-fit"}`}
                >
                    <CardContent className="h-full p-0">
                        <Image
                            unoptimized
                            src={attribs.src}
                            alt={attribs.alt || "Image de l'article"}
                            width={toDimension(attribs.width, 1600)}
                            height={toDimension(attribs.height, 900)}
                            className="h-full w-full max-h-screen object-contain md:max-h-[80vh]"
                        />
                    </CardContent>
                </Card>
            </div>
        );
    },

    iframe: ({ attribs }) => (
        <div className="my-6 aspect-video overflow-hidden rounded-base border-2 border-border shadow-shadow">
            <iframe
                title={attribs.title || "Contenu embarqué"}
                src={attribs.src}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            />
        </div>
    ),

    video: ({ node, attribs, children }) => {

        if (!attribs.src) {
            return null;
        }

        const fillsParent = hasAncestorWithClassName(node, SELF_LAYOUT_BLOCKS);

        return (
            <div className={fillsParent ? "w-full" : "w-full px-2 md:px-8"}>
                <Card
                    className={`mx-auto overflow-hidden border-2 p-0 cursor-default hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none ${fillsParent ? "h-full w-full" : "w-fit"}`}
                >
                    <CardContent className="h-full p-0">
                        <video
                            width={toDimension(attribs.width, 1600)}
                            height={toDimension(attribs.height, 900)}
                            className="h-full w-full max-h-screen object-contain md:max-h-[80vh]"
                            autoPlay
                            muted
                            loop
                            playsInline
                            poster={attribs.poster}
                            src={attribs.src}
                        >
                            {children}
                        </video>
                    </CardContent>
                </Card>
            </div>
        );
    },

    source: ({ attribs }) => <source src={attribs.src} type={attribs.type} />,
};
