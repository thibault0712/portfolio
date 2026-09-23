import { WORDPRESS_GRAPHQL_URL, WORDPRESS_REVALIDATE_SECONDS } from "@/src/config/wordpress";
import { type WordPressPost } from "@/src/models/WordPressPost";
import { createAppError, IS_BUILD } from "@/src/lib/errors";

type WordPressFetchResponse<T> = {
    data?: T;
    errors?: Array<{ message: string }>;
};

const WORDPRESS_POST_QUERY = /* GraphQL */ `
    query WordPressPost($slug: ID!) {
        post(id: $slug, idType: SLUG) {
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
    }
`;

async function fetchWordPressPost(slug: string): Promise<WordPressPost | null> {
    let response: Response;

    try {
        response = await fetch(WORDPRESS_GRAPHQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: WORDPRESS_POST_QUERY,
                variables: {
                    slug,
                },
            }),
            next: {
                revalidate: WORDPRESS_REVALIDATE_SECONDS,
            },
        });
    } catch (error) {
        if (IS_BUILD) {
            console.warn("WordPress indisponible pendant le build:", error);
            return null;
        }

        throw createAppError("Impossible de joindre le service de contenu.", 503);
    }

        if (!response.ok) {
            if (IS_BUILD) return null;
                throw createAppError(
                `Impossible de récupérer l'article WordPress (${response.status}).`,
                response.status
            );
        }

        const json = (await response.json()) as WordPressFetchResponse<{
            post: WordPressPost | null;
        }>;

        if (json.errors?.length) {
            if (IS_BUILD) return null;
            throw createAppError(json.errors[0].message, 502);
        }

        return json.data?.post ?? null;

}

export default fetchWordPressPost;