const DEFAULT_WORDPRESS_URL = "http://localhost";
const DEFAULT_WORDPRESS_GRAPHQL_PATH = "/graphql";
const DEFAULT_WORDPRESS_CATEGORY_PROJECTS_ID = 3;
const DEFAULT_WORDPRESS_CATEGORY_BLOG_ID = 4;
const DEFAULT_MAX_ARTICLES_PROJECTS = 4;
const DEFAULT_MAX_ARTICLES_BLOG = 4;
const DEFAULT_WORDPRESS_REVALIDATE_SECONDS = 300;

function readNumberEnv(name: string, fallback: number) {
    const value = process.env[name];

    if (!value) {
        return fallback;
    }

    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) {
        throw new Error(`La variable d'environnement ${name} doit être un nombre.`);
    }

    return parsedValue;
}

function readStringEnv(name: string, fallback: string) {
    return process.env[name] || fallback;
}

export const WORDPRESS_URL = readStringEnv("WORDPRESS_URL", DEFAULT_WORDPRESS_URL).replace(/\/$/, "");
export const WORDPRESS_GRAPHQL_URL = readStringEnv(
    "WORDPRESS_GRAPHQL_URL",
    `${WORDPRESS_URL}${DEFAULT_WORDPRESS_GRAPHQL_PATH}`
);
export const WORDPRESS_CATEGORY_PROJECTS_ID = readNumberEnv(
    "WORDPRESS_CATEGORY_PROJECTS_ID",
    DEFAULT_WORDPRESS_CATEGORY_PROJECTS_ID
);
export const WORDPRESS_CATEGORY_BLOG_ID = readNumberEnv(
    "WORDPRESS_CATEGORY_BLOG_ID",
    DEFAULT_WORDPRESS_CATEGORY_BLOG_ID
);
export const MAX_ARTICLES_PROJECTS = readNumberEnv(
    "MAX_ARTICLES_PROJECTS",
    DEFAULT_MAX_ARTICLES_PROJECTS
);
export const MAX_ARTICLES_BLOG = readNumberEnv(
    "MAX_ARTICLES_BLOG",
    DEFAULT_MAX_ARTICLES_BLOG
);
export const WORDPRESS_REVALIDATE_SECONDS = readNumberEnv(
    "WORDPRESS_REVALIDATE_SECONDS",
    DEFAULT_WORDPRESS_REVALIDATE_SECONDS
);