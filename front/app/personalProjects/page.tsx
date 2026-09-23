import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/src/config/site";
import { WORDPRESS_CATEGORY_PROJECTS_ID } from "@/src/config/wordpress";
import { fetchWordPressPostsPage } from "@/src/api/fetch/fetchWordPressPosts";
import WordPressSectionScreen from "@/src/ui/screens/WordPressSectionScreen";

export const metadata: Metadata = {
    title: "Projets personnels",
    description: "Découvrez mes projets personnels.",
    alternates: {
        canonical: `${SITE_URL}/personalProjects`,
    },
};

export default async function Page() {
    const result = await fetchWordPressPostsPage({
        categoryId: WORDPRESS_CATEGORY_PROJECTS_ID,
        first: 25,
    });

    if (!result.nodes.length) {
        notFound();
    }

    return (
        <WordPressSectionScreen
            badgeLabel="Projet"
            basePath="/personalProjects"
            categoryId={WORDPRESS_CATEGORY_PROJECTS_ID}
            navTitle="Mes projets"
            pageInfo={result.pageInfo}
            posts={result.nodes}
            title="Mes projets"
        />
    );
}
