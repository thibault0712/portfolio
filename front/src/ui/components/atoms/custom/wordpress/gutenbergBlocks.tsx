import { Element } from "html-react-parser";
import type { BlockRenderer, Renderer } from "./types";
import { getClassNames, getColumnCount, getGridColsClass, hasClassName } from "./utils";

/**
 * Blocs Gutenberg identifiés par une classe CSS exacte.
 * L'ordre ne compte que si un même élément porte plusieurs de ces classes :
 * la correspondance est faite sur le nom de classe entier, pas sur une sous-chaîne
 * (`wp-block-columns` ne matche donc jamais `wp-block-column`).
 */
export const gutenbergBlocks: BlockRenderer[] = [
    {
        className: "is-layout-grid",
        render: ({ node, children }) => (
            <div className={`my-6 grid grid-cols-1 gap-6 ${getGridColsClass(node)}`}>{children}</div>
        ),
    },
    {
        className: "wp-block-gallery",
        // WordPress émet ce bloc en <figure> (>= 5.9) ou en <div> : on garde la balise d'origine.
        render: ({ node, children }) => {
            const Tag = node.name === "figure" ? "figure" : "div";

            return <Tag className={`my-6 grid grid-cols-1 gap-4 ${getGridColsClass(node)}`}>{children}</Tag>;
        },
    },
    {
        className: "blocks-gallery-grid",
        render: ({ node, children }) => (
            <ul className={`my-6 grid list-none grid-cols-1 gap-4 p-0 ${getGridColsClass(node)}`}>{children}</ul>
        ),
    },
    {
        className: "wp-block-columns",
        render: ({ node, children }) => {
            const gridClass =
                getColumnCount(node) === null
                    ? "md:grid-flow-col md:grid-cols-none"
                    : getGridColsClass(node);

            return <div className={`my-6 grid grid-cols-1 gap-6 ${gridClass}`}>{children}</div>;
        },
    },
    {
        className: "wp-block-column",
        render: ({ children }) => <div className="w-full min-w-0">{children}</div>,
    },
    {
        className: "wp-block-media-text__content",
        render: ({ children }) => <div className="w-full space-y-4">{children}</div>,
    },
    {
        className: "wp-block-media-text",
        render: ({ node, children }) => {
            const reversed = hasClassName(node, "has-media-on-the-right");
            const columnsClass = reversed ? "md:grid-cols-[1.1fr_0.9fr]" : "md:grid-cols-[0.9fr_1.1fr]";

            return <div className={`my-6 grid grid-cols-1 items-center gap-6 ${columnsClass}`}>{children}</div>;
        },
    },
    {
        className: "wp-block-buttons",
        render: ({ children }) => <div className="my-6 flex flex-wrap gap-4">{children}</div>,
    },
    {
        className: "wp-block-button",
        render: ({ children }) => <div className="inline-block">{children}</div>,
    },
    {
        className: "blocks-gallery-item",
        render: ({ children }) => <li className="p-0">{children}</li>,
    },
    {
        className: "wp-block-image",
        render: ({ children }) => <figure>{children}</figure>,
    },
];

/** Renvoie le renderer du premier bloc Gutenberg reconnu sur ce noeud, s'il y en a un. */
export function findGutenbergBlock(node: Element): Renderer | null {
    const classNames = getClassNames(node);

    if (classNames.size === 0) {
        return null;
    }

    return gutenbergBlocks.find((block) => classNames.has(block.className))?.render ?? null;
}
