import sanitizeHtml from "sanitize-html";
import type { WordPressMediaItem, WordPressPost } from "@/src/models/WordPressPost";

export function stripHtml(value: string | null | undefined) {
    if (!value) {
        return "";
    }

    return sanitizeHtml(value, {
        allowedTags: [],
        allowedAttributes: {},
    }).trim();
}

export function getWordPressMediaUrl(mediaItem: WordPressMediaItem | null | undefined) {
    return mediaItem?.mediaItemUrl || mediaItem?.sourceUrl || null;
}

export function isWordPressVideoMedia(mediaItem: WordPressMediaItem | null | undefined) {
    return Boolean(mediaItem?.mimeType?.startsWith("video/"));
}

export function getWordPressPostCoverUrl(post: WordPressPost) {
    return getWordPressMediaUrl(getWordPressPostCoverMedia(post));
}

export function getWordPressPostCoverMedia(post: WordPressPost) {
    return post.personalProject?.illustrationMedia?.node
        ?? post.article?.illustrationMedia?.node
        ?? null;
}

export function getWordPressPostDescription(post: WordPressPost) {
    return post.personalProject?.description
        || post.article?.description
        || stripHtml(post.excerpt)
        || stripHtml(post.content);
}

export function getWordPressPostSeoTitle(post: WordPressPost) {
    return post.seo?.title || stripHtml(post.title);
}

export function getWordPressPostSeoDescription(post: WordPressPost) {
    return post.seo?.metaDescription || getWordPressPostDescription(post);
}