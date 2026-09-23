import { Element } from "html-react-parser";

/**
 * Tailwind ne peut pas générer de classe construite dynamiquement
 * (`md:grid-cols-${n}` est purgé au build), il faut donc des littéraux.
 */
const GRID_COLS_CLASS: Record<number, string> = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
};

const DEFAULT_COLUMN_COUNT = 2;

export function getClassNames(node: Element): Set<string> {
    return new Set((node.attribs.class || "").split(/\s+/).filter(Boolean));
}

export function hasClassName(node: Element, className: string): boolean {
    return getClassNames(node).has(className);
}

export function getTextAlignClass(node: Element): string {
    const textAlignClasses: Record<string, string> = {
        "has-text-align-left": "text-left",
        "has-text-align-center": "text-center",
        "has-text-align-right": "text-right",
        "has-text-align-justify": "text-justify",
    };

    for (const [gutenbergClass, tailwindClass] of Object.entries(textAlignClasses)) {
        if (hasClassName(node, gutenbergClass)) {
            return tailwindClass;
        }
    }

    return "";
}

/** Lit le nombre de colonnes annoncé par Gutenberg (`columns-3`, `has-3-columns`). */
export function getColumnCount(node: Element): number | null {
    for (const className of getClassNames(node)) {
        const match = /^columns-(\d)$/.exec(className) ?? /^has-(\d)-columns$/.exec(className);

        if (match) {
            return Number(match[1]);
        }
    }

    return null;
}

export function getGridColsClass(node: Element, fallback = DEFAULT_COLUMN_COUNT): string {
    const count = getColumnCount(node) ?? fallback;

    return GRID_COLS_CLASS[count] ?? GRID_COLS_CLASS[DEFAULT_COLUMN_COUNT];
}

/** Cherche un ancêtre portant l'une des classes données. */
export function hasAncestorWithClassName(node: Element, classNames: string[]): boolean {
    const wanted = new Set(classNames);

    for (let parent = node.parent; parent; parent = parent.parent) {
        if (parent instanceof Element) {
            for (const className of getClassNames(parent)) {
                if (wanted.has(className)) {
                    return true;
                }
            }
        }
    }

    return false;
}

export function hasAncestorTag(node: Element, tagName: string): boolean {
    for (let parent = node.parent; parent; parent = parent.parent) {
        if (parent instanceof Element && parent.name === tagName) {
            return true;
        }
    }

    return false;
}

export function isExternalLink(href: string): boolean {
    return /^https?:\/\//i.test(href);
}

export function toDimension(value: string | undefined, fallback: number): number {
    const parsed = Number(value);

    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
