import type { MetadataRoute } from "next";
import { SITE_URL } from "@/src/config/site";
import { WORDPRESS_CATEGORY_BLOG_ID, WORDPRESS_CATEGORY_PROJECTS_ID } from "@/src/config/wordpress";
import { fetchWordPressPostsPage } from "@/src/api/fetch/fetchWordPressPosts";
import { getWordPressPostCoverUrl } from "@/src/lib/wordpress";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const routes: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified: new Date(),
            priority: 1,
        },
        {
            url: `${SITE_URL}/articles`,
            lastModified: new Date(),
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/personalProjects`,
            lastModified: new Date(),
            priority: 0.9,
        },
    ];

    const [projectsResult, blogPostsResult] = await Promise.allSettled([
        fetchWordPressPostsPage({
            categoryId: WORDPRESS_CATEGORY_PROJECTS_ID,
            first: 100,
        }),
        fetchWordPressPostsPage({
            categoryId: WORDPRESS_CATEGORY_BLOG_ID,
            first: 100,
        }),
    ]);

    const projects = projectsResult.status === "fulfilled"
        ? projectsResult.value
        : null;
    const blogPosts = blogPostsResult.status === "fulfilled"
        ? blogPostsResult.value
        : null;

    const projectRoutes = projects?.nodes.map((project) => ({
        url: `${SITE_URL}/personalProjects/${project.slug}`,
        lastModified: project.modified ? new Date(project.modified) : new Date(),
        priority: 0.8,
        images: getWordPressPostCoverUrl(project) ? [getWordPressPostCoverUrl(project)!] : [],
    }));

    const blogRoutes = blogPosts?.nodes.map((post) => ({
        url: `${SITE_URL}/articles/${post.slug}`,
        lastModified: post.modified ? new Date(post.modified) : new Date(),
        priority: 0.7,
        images: getWordPressPostCoverUrl(post) ? [getWordPressPostCoverUrl(post)!] : [],
    }));

    return [...routes, ...(projectRoutes ?? []), ...(blogRoutes ?? [])];
}