import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/src/config/site";
import fetchWordPressPost from "@/src/api/fetch/fetchWordPressPost";
import WordPressPostScreen from "@/src/ui/screens/WordPressPostScreen";
import { getWordPressPostSeoDescription, getWordPressPostSeoTitle } from "@/src/lib/wordpress";
import { getWordPressPostCoverUrl } from "@/src/lib/wordpress";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await fetchWordPressPost(slug);

    if (!post) {
        return {
            title: "Article introuvable",
            description: "Cet article n'existe pas.",
        };
    }

    return {
        title: getWordPressPostSeoTitle(post),
        description: getWordPressPostSeoDescription(post).slice(0, 150),
        alternates: {
            canonical: `${SITE_URL}/blog/${slug}`,
        },
        openGraph: {
            title: getWordPressPostSeoTitle(post),
            description: getWordPressPostSeoDescription(post),
            url: `${SITE_URL}/blog/${slug}`,
            type: "article",
            siteName: "Falézan Thibault",
            images: getWordPressPostCoverUrl(post)
                ? [
                    {
                        url: getWordPressPostCoverUrl(post)!,
                        width: 1200,
                        height: 630,
                    },
                ]
                : [],
        },
        twitter: {
            card: "summary_large_image",
            title: getWordPressPostSeoTitle(post),
            description: getWordPressPostSeoDescription(post).slice(0, 150),
            images: getWordPressPostCoverUrl(post) ? [getWordPressPostCoverUrl(post)!] : [],
        },
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await fetchWordPressPost(slug);

    if (!post) {
        notFound();
    }

    return <WordPressPostScreen navTitle="Mes articles" navLink="/blog" post={post} />;
}
