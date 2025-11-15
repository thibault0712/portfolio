import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import React, {ComponentPropsWithoutRef, isValidElement} from "react";
import Link from "next/link";
import {Card, CardContent} from "@/components/ui/card";
import Image from "next/image";

const H1 = ({ children, ...props }: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="text-3xl font-extrabold pt-6" {...props}>
        {children}
    </h1>
);

const H2 = ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="text-2xl font-bold pt-4" {...props}>
        {children}
    </h2>
);

const H3 = ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h2 className="text-xl font-bold" {...props}>
        {children}
    </h2>
)

const p = ({ children, ...props }: ComponentPropsWithoutRef<"p">) => (
    <p className="text-justify font-normal" {...props}>
        {children}
    </p>
);

const a = ({ children, href, ...props }: ComponentPropsWithoutRef<"a">) => (
    <Link className="text-justify text-blue-500 font-base" href={href ?? ""} {...props}>
        {children}
    </Link>
);

const li = ({ children, ...props }: ComponentPropsWithoutRef<"li">) => (
    <li className="text-justify font-normal" {...props}>
        {children}
    </li>
);

const ul = ({ children, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul className="list-disc space-y-2 pl-8" {...props}>
        {children}
    </ul>
);

const table = ({ children, ...props }: ComponentPropsWithoutRef<"table">) => (
    <table className="w-full md:table md:table-fixed" {...props}>
        {children}
    </table>
);

const tr = ({ children, ...props }: ComponentPropsWithoutRef<"tr">) => (
    <tr className="block md:table-row" {...props}>
        {children}
    </tr>
);

const th = ({ children, ...props }: ComponentPropsWithoutRef<"th">) => {

    if (children != undefined) {
        return (
            <th className="hidden text-center font-bold py-4 text-xl md:table-cell" {...props}>
                {children}
            </th>
        );
    }


}

const td = ({ children, ...props }: ComponentPropsWithoutRef<"td">) => {

    const isImage = isValidElement(children) && typeof children.type === 'function' && children.type.name === 'img';

    const alignPosition = isImage ? "align-middle" : "align-top";

    return (
        <td className={"block py-4 md:table-cell relative font-normal " + alignPosition} {...props}>
            {children}
        </td>
    );
};

const img = ({ children, src, alt }: ComponentPropsWithoutRef<"img">) => {

    let isValidUrl = true;

    if (src instanceof Blob || src == undefined) {
        isValidUrl = false;
    }

    if (typeof src === "string") {
        try {
            new URL(src); // Testting URL
        } catch (_) {
            isValidUrl = false;
        }
    }

    if (!isValidUrl) {
        console.error(alt + "is not a valid URL");

        return (
            <p className={"font-normal"}>
                {alt}
            </p>
        )
    }

    return (
        <div className={"w-full px-2 md:px-8"}>
            <Card className="border-2 overflow-hidden mx-auto p-0 w-fit hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none cursor-default">
                <CardContent className={"p-0"}>
                    <Image
                        src={src as string}
                        alt={alt ?? "Image d'illustration"}
                        className="object-contain w-full max-h-[100vh] md:max-h-[80vh]"
                        width={250000}
                        height={3500}
                    />
                    {children}
                </CardContent>
            </Card>
        </div>

    )
};

type MarkdownConversionProps = {
    children: string;
}

const MarkdownConversion = (markdownConversionProps: MarkdownConversionProps) => {
    return (
        <div className={"space-y-6"}>
            <Markdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]} components={{
                h1: H1,
                h2: H2,
                h3: H3,
                p: p,
                a: a,
                li: li,
                ul: ul,
                img: img,
                table: table,
                th: th,
                tr: tr,
                td: td
            }}>
                {markdownConversionProps.children}
            </Markdown>
        </div>
    )
}

export default MarkdownConversion;