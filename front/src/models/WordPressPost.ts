export type WordPressMediaItem = {
    altText: string | null;
    mediaItemUrl: string | null;
    mediaType: string | null;
    mimeType: string | null;
    sourceUrl: string | null;
    title: string | null;
};

export type WordPressPresentationField = {
    node: WordPressMediaItem | null;
} | null;

export type WordPressArticleFields = {
    description: string | null;
    illustrationMedia: WordPressPresentationField;
};

export type WordPressPersonalProjectFields = {
    startedAt: string | null;
    description: string | null;
    github: string | null;
    demonstrationWebsite: string | null;
    endedAt: string | null;
    illustrationMedia: WordPressPresentationField;
};

export type WordPressSeoFields = {
    metaDescription: string | null;
    title: string | null;
};

export type WordPressCategory = {
    databaseId: number;
    name: string;
    slug: string;
};

export type WordPressTag = {
    databaseId: number;
    name: string;
    slug: string;
};

export type WordPressAuthor = {
    name: string;
    slug: string;
};

export type WordPressPost = {
    article: WordPressArticleFields | null;
    author: {
        node: WordPressAuthor | null;
    } | null;
    personalProject: WordPressPersonalProjectFields | null;
    categories: {
        nodes: WordPressCategory[];
    };
    content: string;
    databaseId: number;
    date: string | null;
    excerpt: string;
    modified: string | null;
    tags: {
        nodes: WordPressTag[];
    };
    seo: WordPressSeoFields | null;
    slug: string;
    title: string;
};

export type WordPressPostConnectionPageInfo = {
    endCursor: string | null;
    hasNextPage: boolean;
    hasPreviousPage?: boolean;
    startCursor?: string | null;
};

export type WordPressPostConnection = {
    nodes: WordPressPost[];
    pageInfo: WordPressPostConnectionPageInfo;
};

export type WordPressPostListResult = {
    nodes: WordPressPost[];
    pageInfo: WordPressPostConnectionPageInfo;
};