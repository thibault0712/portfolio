import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/src/config/site";
import fetchWordPressPost from "@/src/api/fetch/fetchWordPressPost";
import WordPressPostScreen from "@/src/ui/screens/WordPressPostScreen";
import { getWordPressPostSeoDescription, getWordPressPostSeoTitle } from "@/src/lib/wordpress";
import { getWordPressPostCoverUrl } from "@/src/lib/wordpress";

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const projectInfo = await fetchWordPressPost(slug);

    if (!projectInfo) {
        return {
            title: "Projet introuvable",
            description: "Ce projet n'existe pas.",
        };
    }

    return {
        title: getWordPressPostSeoTitle(projectInfo),
        description: getWordPressPostSeoDescription(projectInfo).slice(0, 150),
        alternates: {
            canonical: `${SITE_URL}/projects/${slug}`,
        },
        openGraph: {
            title: getWordPressPostSeoTitle(projectInfo),
            description: getWordPressPostSeoDescription(projectInfo),
            url: `${SITE_URL}/projects/${slug}`,
            type: "article",
            siteName: "Falézan Thibault",
            images: getWordPressPostCoverUrl(projectInfo)
                ? [
                    {
                        url: getWordPressPostCoverUrl(projectInfo)!,
                        width: 1200,
                        height: 630,
                    },
                ]
                : [],
        },
        twitter: {
            card: "summary_large_image",
            title: getWordPressPostSeoTitle(projectInfo),
            description: getWordPressPostSeoDescription(projectInfo).slice(0, 150),
            images: getWordPressPostCoverUrl(projectInfo) ? [getWordPressPostCoverUrl(projectInfo)!] : [],
        },
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const projectInfo = await fetchWordPressPost(slug);

    if (!projectInfo) {
        notFound();
    }

    return <WordPressPostScreen navTitle="Mes projets" navLink="/projects" post={projectInfo} />;
}
