import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/src/config/site";
import { WORDPRESS_CATEGORY_PROJECTS_ID } from "@/src/config/wordpress";
import { fetchWordPressChildCategories, fetchWordPressPostsPage } from "@/src/api/fetch/fetchWordPressPosts";
import WordPressSectionScreen from "@/src/ui/screens/WordPressSectionScreen";

export const metadata: Metadata = {
    title: "Mes projets",
    description: "Découvrez mes projets personnels et scolaires.",
    alternates: {
        canonical: `${SITE_URL}/projects`,
    },
};

export default async function Page() {
    const [result, categories] = await Promise.all([
        fetchWordPressPostsPage({ categoryId: WORDPRESS_CATEGORY_PROJECTS_ID, first: 25 }),
        fetchWordPressChildCategories(WORDPRESS_CATEGORY_PROJECTS_ID),
    ]);

    if (!result.nodes.length) {
        notFound();
    }

    return (
        <WordPressSectionScreen
            badgeLabel="Projet"
            basePath="/projects"
            categoryId={WORDPRESS_CATEGORY_PROJECTS_ID}
            categories={categories}
            navTitle="Mes projets"
            pageInfo={result.pageInfo}
            posts={result.nodes}
            title="Mes projets"
        />
    );
}
