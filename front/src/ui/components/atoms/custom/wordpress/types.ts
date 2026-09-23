import type { Element } from "html-react-parser";
import type { ReactElement, ReactNode } from "react";

/**
 * Props reçues par chaque renderer du registre.
 * - `node` : le noeud DOM d'origine, utile pour inspecter les ancêtres.
 * - `attribs` : les attributs HTML déjà nettoyés par sanitize-html.
 * - `children` : les enfants déjà convertis en React par `domToReact`.
 */
export type RenderProps = {
    node: Element;
    attribs: Record<string, string>;
    children: ReactNode;
};

/** `ReactElement | null` (et non `ReactNode`) pour rester compatible avec le retour de `replace`. */
export type Renderer = (props: RenderProps) => ReactElement | null;

/** Un bloc Gutenberg reconnu par une de ses classes CSS. */
export type BlockRenderer = {
    className: string;
    render: Renderer;
};
