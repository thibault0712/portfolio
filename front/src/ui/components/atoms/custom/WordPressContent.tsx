import parse, { domToReact, Element, type DOMNode, type HTMLReactParserOptions } from "html-react-parser";
import sanitizeHtml from "sanitize-html";
import { findGutenbergBlock } from "./wordpress/gutenbergBlocks";
import { renderMap } from "./wordpress/renderMap";
import { sanitizeOptions } from "./wordpress/sanitizeConfig";
import type { Renderer } from "./wordpress/types";

function WordPressContent({ html }: { html: string }) {
    const sanitizedHtml = sanitizeHtml(html, sanitizeOptions);

    const options: HTMLReactParserOptions = {
        replace(domNode) {
            if (!(domNode instanceof Element)) {
                return undefined;
            }

            // Un bloc Gutenberg (reconnu à sa classe) prime sur le rendu par balise,
            // car il porte la mise en page (grilles, colonnes, galeries).
            const renderer: Renderer | undefined = findGutenbergBlock(domNode) ?? renderMap[domNode.name];

            if (!renderer) {
                // Seuls les conteneurs anonymes ont besoin d'un espacement par défaut.
                return domNode.name === "div" ? (
                    <div className="space-y-4">{domToReact(domNode.children as DOMNode[], options)}</div>
                ) : undefined;
            }

            return renderer({
                node: domNode,
                attribs: domNode.attribs,
                children: domToReact(domNode.children as DOMNode[], options),
            });
        },
    };

    return <div className="space-y-6">{parse(sanitizedHtml, options)}</div>;
}

export default WordPressContent;
