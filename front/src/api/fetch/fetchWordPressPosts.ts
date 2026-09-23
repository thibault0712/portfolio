import {
    MAX_ARTICLES_BLOG,
    MAX_ARTICLES_PROJECTS,
    WORDPRESS_CATEGORY_BLOG_ID,
    WORDPRESS_CATEGORY_PROJECTS_ID,
    WORDPRESS_GRAPHQL_URL,
    WORDPRESS_REVALIDATE_SECONDS,
} from "@/src/config/wordpress";
import {
    type WordPressPostConnection,
    type WordPressPostListResult,
} from "@/src/models/WordPressPost";
import { createAppError, IS_BUILD } from "@/src/lib/errors";

type WordPressFetchResponse<T> = {
    data?: T;
    errors?: Array<{ message: string }>;
};

export type WordPressPostsFilterParams = {
    categoryId: number;
    first?: number;
    after?: string | null;
    search?: string | null;
    categorySlug?: string | null;
    tagSlug?: string | null;
    authorSlug?: string | null;
    dateFrom?: string | null; // YYYY-MM-DD
    dateTo?: string | null; // YYYY-MM-DD
    sortBy?: "date-desc" | "date-asc" | "title-asc" | "title-desc";
};

const WORDPRESS_POSTS_QUERY = /* GraphQL */ `
    query WordPressPosts($first: Int!, $after: String, $where: RootQueryToPostConnectionWhereArgs) {
        posts(
            first: $first
            after: $after
            where: $where
        ) {
            nodes {
                article {
                    description
                    illustrationMedia {
                        node {
                            altText
                            mediaItemUrl
                            mediaType
                            mimeType
                            sourceUrl
                            title
                        }
                    }
                }
                author {
                    node {
                        name
                        slug
                    }
                }
                personalProject {
                    startedAt
                    description
                    github
                    demonstrationWebsite
                    endedAt
                    illustrationMedia {
                        node {
                            altText
                            mediaItemUrl
                            mediaType
                            mimeType
                            sourceUrl
                            title
                        }
                    }
                }
                categories {
                    nodes {
                        databaseId
                        name
                        slug
                    }
                }
                content
                databaseId
                date
                excerpt
                modified
                tags {
                    nodes {
                        databaseId
                        name
                        slug
                    }
                }
                seo {
                    metaDescription
                    title
                }
                slug
                title
            }
            pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
            }
        }
    }
`;

export function buildWordPressWhereArgs({
    categoryId,
    search,
    categorySlug,
    tagSlug,
    authorSlug,
    dateFrom,
    dateTo,
    sortBy = "date-desc",
}: WordPressPostsFilterParams) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};

    if (categoryId) {
        where.categoryId = categoryId;
    }

    if (search && search.trim()) {
        where.search = search.trim();
    }

    if (categorySlug && categorySlug !== "all") {
        where.categoryName = categorySlug;
    }

    if (tagSlug && tagSlug !== "all") {
        where.tag = tagSlug;
    }

    if (authorSlug && authorSlug !== "all") {
        where.authorName = authorSlug;
    }

    if (categoryId === WORDPRESS_CATEGORY_PROJECTS_ID) {
        if (dateFrom || dateTo) {
            where.projectDateRange = {
                ...(dateFrom ? { from: dateFrom } : {}),
                ...(dateTo ? { to: dateTo } : {}),
            };
        }
    } else if (dateFrom || dateTo) {
        const after = dateFrom ? new Date(dateFrom) : null;
        const before = dateTo ? new Date(dateTo) : null;
        if ((after && !isNaN(after.getTime())) || (before && !isNaN(before.getTime()))) {
            where.dateQuery = {
                ...(after
                    ? { after: { year: after.getFullYear(), month: after.getMonth() + 1, day: after.getDate() } }
                    : {}),
                ...(before
                    ? { before: { year: before.getFullYear(), month: before.getMonth() + 1, day: before.getDate() } }
                    : {}),
                inclusive: true,
            };
        }
    }

    if (sortBy === "title-asc") {
        where.orderby = [{ field: "TITLE", order: "ASC" }];
    } else if (sortBy === "title-desc") {
        where.orderby = [{ field: "TITLE", order: "DESC" }];
    } else if (sortBy === "date-asc") {
        if (categoryId === WORDPRESS_CATEGORY_PROJECTS_ID) {
            where.orderByAcf = { key: "endedAt", order: "ASC", type: "CHAR" };
        } else {
            where.orderby = [{ field: "DATE", order: "ASC" }];
        }
    } else {
        // date-desc (default)
        if (categoryId === WORDPRESS_CATEGORY_PROJECTS_ID) {
            where.orderByAcf = { key: "endedAt", order: "DESC", type: "CHAR" };
        } else {
            where.orderby = [{ field: "DATE", order: "DESC" }];
        }
    }

    return where;
}

export async function fetchWordPressFilteredPosts(
    params: WordPressPostsFilterParams,
    forceRefresh = false
): Promise<WordPressPostListResult> {
    const { first = 25, after } = params;
    const where = buildWordPressWhereArgs(params);
    const EMPTY_POSTS = { nodes: [], pageInfo: { endCursor: null, hasNextPage: false } };

    let response: Response;

    try {
        response = await fetch(WORDPRESS_GRAPHQL_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: WORDPRESS_POSTS_QUERY,
                variables: { first, after: after ?? null, where },
            }),
            ...(forceRefresh
                ? { cache: "no-store" }
                : { next: { revalidate: WORDPRESS_REVALIDATE_SECONDS } }),
        });
    } catch (error) {
        if (IS_BUILD) {
            console.warn("WordPress indisponible pendant le build:", error);
            return EMPTY_POSTS;
        }
        throw createAppError("Impossible de joindre le service de contenu.", 503);
    }

    if (!response.ok) {
        if (IS_BUILD) return EMPTY_POSTS;
        throw createAppError(
            `Impossible de récupérer les articles WordPress (${response.status}).`,
            response.status
        );
    }

    const json = (await response.json()) as WordPressFetchResponse<{
        posts: WordPressPostConnection;
    }>;

    if (json.errors?.length) {
        if (IS_BUILD) return EMPTY_POSTS;
        throw createAppError(json.errors[0].message, 502);
    }

    return json.data?.posts ?? EMPTY_POSTS;

}

export async function fetchWordPressProjectsPreview(limit = MAX_ARTICLES_PROJECTS) {
    const result = await fetchWordPressFilteredPosts({
        categoryId: WORDPRESS_CATEGORY_PROJECTS_ID,
        first: limit + 1,
    });
    const refreshedResult = result.nodes.length
        ? result
        : await fetchWordPressFilteredPosts(
            {
                categoryId: WORDPRESS_CATEGORY_PROJECTS_ID,
                first: limit + 1,
            },
            true
        );

    return {
        nodes: refreshedResult.nodes.slice(0, limit),
        pageInfo: refreshedResult.pageInfo,
        hasMore: refreshedResult.nodes.length > limit || refreshedResult.pageInfo.hasNextPage,
    };
}

export async function fetchWordPressBlogPreview(limit = MAX_ARTICLES_BLOG) {
    const result = await fetchWordPressFilteredPosts({
        categoryId: WORDPRESS_CATEGORY_BLOG_ID,
        first: limit + 1,
    });
    const refreshedResult = result.nodes.length
        ? result
        : await fetchWordPressFilteredPosts(
            {
                categoryId: WORDPRESS_CATEGORY_BLOG_ID,
                first: limit + 1,
            },
            true
        );

    return {
        nodes: refreshedResult.nodes.slice(0, limit),
        pageInfo: refreshedResult.pageInfo,
        hasMore: refreshedResult.nodes.length > limit || refreshedResult.pageInfo.hasNextPage,
    };
}

export async function fetchWordPressPostsPage(
    params: WordPressPostsFilterParams
): Promise<WordPressPostListResult> {
    const result = await fetchWordPressFilteredPosts(params);

    return result.nodes.length
        ? result
        : fetchWordPressFilteredPosts(params, true);
}

export default fetchWordPressFilteredPosts;
