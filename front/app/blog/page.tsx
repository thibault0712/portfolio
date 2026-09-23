import type { Metadata } from "next";
import { SITE_URL } from "@/src/config/site";
import { WORDPRESS_CATEGORY_BLOG_ID } from "@/src/config/wordpress";
import { fetchWordPressPostsPage } from "@/src/api/fetch/fetchWordPressPosts";
import WordPressSectionScreen from "@/src/ui/screens/WordPressSectionScreen";

export const metadata: Metadata = {
    title: "Mes articles",
    description: "Tutoriels et explications techniques.",
    alternates: {
        canonical: `${SITE_URL}/blog`,
    },
};

export default async function Page() {
    const result = await fetchWordPressPostsPage({
        categoryId: WORDPRESS_CATEGORY_BLOG_ID,
        first: 25,
    });

    return (
        <WordPressSectionScreen
            badgeLabel="Article"
            basePath="/blog"
            categoryId={WORDPRESS_CATEGORY_BLOG_ID}
            navTitle="Mes articles"
            pageInfo={result.pageInfo}
            posts={result.nodes}
            title="Mes articles"
        />
    );
}
