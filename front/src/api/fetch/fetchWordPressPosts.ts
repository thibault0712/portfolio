import {
    MAX_ARTICLES_BLOG,
    MAX_ARTICLES_PROJECTS,
    WORDPRESS_CATEGORY_BLOG_ID,
    WORDPRESS_CATEGORY_PROJECTS_ID,
    WORDPRESS_GRAPHQL_URL,
    WORDPRESS_REVALIDATE_SECONDS,
} from "@/src/config/wordpress";
import {
    type WordPressCategory,
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

export async function fetchWordPressChildCategories(parentId: number): Promise<WordPressCategory[]> {
    const query = /* GraphQL */ `
        query ProjectCategories($parentId: Int) {
            categories(where: { parent: $parentId }, first: 100) {
                nodes { databaseId name slug }
            }
        }
    `;

    let response: Response;

    try {
        response = await fetch(WORDPRESS_GRAPHQL_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, variables: { parentId } }),
            next: { revalidate: WORDPRESS_REVALIDATE_SECONDS },
        });
    } catch (error) {
        if (IS_BUILD) {
            console.warn("WordPress indisponible pendant le build (catégories):", error);
            return [];
        }
        throw createAppError("Impossible de récupérer les catégories WordPress.", 503);
    }

    if (!response.ok) {
        if (IS_BUILD) {
            console.warn(`WordPress a répondu avec le statut ${response.status} pendant le build (catégories).`);
            return [];
        }
        throw createAppError(`WordPress a répondu avec le statut ${response.status}.`, response.status);
    }

    const result = await response.json() as WordPressFetchResponse<{ categories?: { nodes?: WordPressCategory[] } }>;
    if (result.errors?.length) {
        if (IS_BUILD) {
            console.warn("Erreur GraphQL WordPress pendant le build (catégories):", result.errors[0].message);
            return [];
        }
        throw createAppError(result.errors.map(({ message }) => message).join(" "), 502);
    }
    return result.data?.categories?.nodes ?? [];
}

const WORDPRESS_POSTS_QUERY = /* GraphQL */ `
    query WordPressPosts($first: Int!, $after: String, $where: RootQueryToPostConnectionWhereArgs, $isProject: Boolean!) {
        posts(
            first: $first
            after: $after
            where: $where
        ) {
            nodes {
                article @skip(if: $isProject) {
                    description
                    illustrationMedia {
                        node {
                            altText
                            mediaItemUrl
                            mediaType
                            mimeType
                            sourceUrl
                        }
                    }
                }
                author @skip(if: $isProject) {
                    node {
                        name
                        slug
                    }
                }
                personalProject @include(if: $isProject) {
                    description
                    github
                    demonstrationWebsite
                    illustrationMedia {
                        node {
                            altText
                            mediaItemUrl
                            mediaType
                            mimeType
                            sourceUrl
                        }
                    }
                }
                categories {
                    nodes {
                        name
                        slug
                    }
                }
                excerpt
                modified
                tags {
                    nodes {
                        name
                        slug
                    }
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
                variables: {
                    first,
                    after: after ?? null,
                    where,
                    isProject: params.categoryId === WORDPRESS_CATEGORY_PROJECTS_ID,
                },
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
        throw createAppError("Impossible de joindre le service de contenu: " + WORDPRESS_GRAPHQL_URL, 503);
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
