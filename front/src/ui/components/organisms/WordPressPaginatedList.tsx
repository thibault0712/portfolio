"use client";

import * as React from "react";
import { motion } from "motion/react";
import PostCard from "@/src/ui/components/molecules/PostCard";
import TitleCard from "@/src/ui/components/molecules/TitleCard";
import WordPressPostFilters, {
    type FilterOption,
    type SortOption,
} from "@/src/ui/components/organisms/WordPressPostFilters";
import {
    type WordPressPost,
    type WordPressPostConnectionPageInfo,
} from "@/src/models/WordPressPost";
import {
    getWordPressPostCoverMedia,
    getWordPressPostDescription,
} from "@/src/lib/wordpress";
import { Button } from "@/src/ui/components/atoms/shadcnUI/button";
import { RotateCcw, Loader2 } from "lucide-react";
import type { DateRange } from "react-day-picker";

type WordPressPaginatedListProps = {
    badgeLabel: string;
    basePath: string;
    categoryId: number;
    initialPosts: WordPressPost[];
    initialPageInfo?: WordPressPostConnectionPageInfo;
    title: string;
};

function formatDateToParam(date: Date | undefined): string | undefined {
    if (!date) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

type DateFilter = DateRange | undefined;

function appendDateRangeParams(params: URLSearchParams, dateRange: DateFilter) {
    const dateFrom = formatDateToParam(dateRange?.from);
    const dateTo = formatDateToParam(dateRange?.to);

    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
}

export default function WordPressPaginatedList({
    badgeLabel,
    basePath,
    categoryId,
    initialPosts,
    initialPageInfo = { endCursor: null, hasNextPage: false },
    title,
}: WordPressPaginatedListProps) {
    const isArticle = badgeLabel.toLowerCase().includes("article");

    // Form inputs state (before validation)
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedCategory, setSelectedCategory] = React.useState("all");
    const [selectedTag, setSelectedTag] = React.useState("all");
    const [selectedAuthor, setSelectedAuthor] = React.useState("all");
    const [selectedDate, setSelectedDate] = React.useState<DateFilter>(
        undefined
    );
    const [sortBy, setSortBy] = React.useState<SortOption>("date-desc");

    // Applied filter states (currently active on server/results)
    const [appliedFilters, setAppliedFilters] = React.useState<{
        search: string;
        category: string;
        tag: string;
        author: string;
        date: DateFilter;
        sort: SortOption;
    }>({
        search: "",
        category: "all",
        tag: "all",
        author: "all",
        date: undefined,
        sort: "date-desc",
    });

    // Posts and pagination state
    const [posts, setPosts] = React.useState<WordPressPost[]>(initialPosts);
    const [pageInfo, setPageInfo] =
        React.useState<WordPressPostConnectionPageInfo>(initialPageInfo);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingMore, setIsLoadingMore] = React.useState(false);

    // Intersection observer sentinel ref
    const observerTargetRef = React.useRef<HTMLDivElement | null>(null);

    // Keep track of all known categories across accumulated posts
    const allCategories: FilterOption[] = React.useMemo(() => {
        const catMap = new Map<string, string>();
        for (const post of posts) {
            for (const cat of post.categories?.nodes || []) {
                if (cat.slug && cat.name) {
                    catMap.set(cat.slug, cat.name);
                }
            }
        }
        return Array.from(catMap.entries()).map(([slug, name]) => ({
            slug,
            name,
        }));
    }, [posts]);

    // Available tags scoped to the selected category
    const availableTags: FilterOption[] = React.useMemo(() => {
        const tagMap = new Map<string, string>();
        const scopedPosts =
            selectedCategory === "all"
                ? posts
                : posts.filter((post) =>
                      post.categories?.nodes?.some(
                          (cat) => cat.slug === selectedCategory
                      )
                  );

        for (const post of scopedPosts) {
            for (const tag of post.tags?.nodes || []) {
                if (tag.slug && tag.name) {
                    tagMap.set(tag.slug, tag.name);
                }
            }
        }
        return Array.from(tagMap.entries()).map(([slug, name]) => ({
            slug,
            name,
        }));
    }, [posts, selectedCategory]);

    // Available authors (for articles)
    const allAuthors: FilterOption[] = React.useMemo(() => {
        if (!isArticle) return [];
        const authorMap = new Map<string, string>();
        for (const post of posts) {
            const author = post.author?.node;
            if (author?.slug && author?.name) {
                authorMap.set(author.slug, author.name);
            }
        }
        return Array.from(authorMap.entries()).map(([slug, name]) => ({
            slug,
            name,
        }));
    }, [posts, isArticle]);

    // Reset tag if not available in current category
    React.useEffect(() => {
        if (
            selectedTag !== "all" &&
            !availableTags.some((t) => t.slug === selectedTag)
        ) {
            setSelectedTag("all");
        }
    }, [availableTags, selectedTag]);

    // Reset button should stay visible if filters were applied on server OR if inputs are modified
    const isFilterAppliedOnServer =
        appliedFilters.search.trim().length > 0 ||
        appliedFilters.category !== "all" ||
        appliedFilters.tag !== "all" ||
        appliedFilters.author !== "all" ||
        appliedFilters.date?.from !== undefined ||
        appliedFilters.sort !== "date-desc";

    const isFormDirty =
        searchQuery.trim().length > 0 ||
        selectedCategory !== "all" ||
        selectedTag !== "all" ||
        selectedAuthor !== "all" ||
        selectedDate?.from !== undefined ||
        sortBy !== "date-desc";

    const canReset = isFilterAppliedOnServer || isFormDirty;

    // Trigger request to Next.js API -> WordPress
    const executeFilterRequest = React.useCallback(
        async (
            filters: {
                search: string;
                category: string;
                tag: string;
                author: string;
                date: DateFilter;
                sort: SortOption;
            }
        ) => {
            setIsLoading(true);
            try {
                const search = filters.search.trim();

                const params = new URLSearchParams({
                    categoryId: String(categoryId),
                    first: "25",
                    ...(search && { search }),
                    ...(filters.category !== "all" && { categorySlug: filters.category }),
                    ...(filters.tag !== "all" && { tagSlug: filters.tag }),
                    ...(isArticle && filters.author !== "all" && { authorSlug: filters.author }),
                    ...(filters.sort && { sortBy: filters.sort }),
                });

                appendDateRangeParams(params, filters.date);

                const res = await fetch(`/api/wordpress-posts?${params}`);

                if (!res.ok) {
                    console.error(`Erreur lors du filtrage: status ${res.status}`);
                    return;
                }

                const { nodes = [], pageInfo = { endCursor: null, hasNextPage: false } } = await res.json();

                setPosts(nodes);
                setPageInfo(pageInfo);
                setAppliedFilters(filters);
            } catch (err) {
                console.error("Erreur réseau de filtrage:", err);
            } finally {
                setIsLoading(false);
            }
        },
        [categoryId, isArticle]
    );

    // Form submission when user clicks "Valider"
    const handleValidateFilters = React.useCallback(() => {
        executeFilterRequest({
            search: searchQuery,
            category: selectedCategory,
            tag: selectedTag,
            author: selectedAuthor,
            date: selectedDate,
            sort: sortBy,
        });
    }, [
        executeFilterRequest,
        searchQuery,
        selectedCategory,
        selectedTag,
        selectedAuthor,
        selectedDate,
        sortBy,
    ]);

    // Reset filters and restore initial unfiltered posts
    const handleResetFilters = React.useCallback(() => {
        setSearchQuery("");
        setSelectedCategory("all");
        setSelectedTag("all");
        setSelectedAuthor("all");
        setSelectedDate(undefined);
        setSortBy("date-desc");

        executeFilterRequest({
            search: "",
            category: "all",
            tag: "all",
            author: "all",
            date: undefined,
            sort: "date-desc",
        });
    }, [executeFilterRequest]);

    // Lazy load next 25 posts via IntersectionObserver
    const loadMore = React.useCallback(async () => {
        if (!pageInfo.hasNextPage || !pageInfo.endCursor || isLoading || isLoadingMore) {
            return;
        }

        setIsLoadingMore(true);
        try {
            const params = new URLSearchParams();
            params.set("categoryId", String(categoryId));
            params.set("first", "25");
            params.set("after", pageInfo.endCursor);

            if (appliedFilters.search.trim()) {
                params.set("search", appliedFilters.search.trim());
            }
            if (appliedFilters.category !== "all") {
                params.set("categorySlug", appliedFilters.category);
            }
            if (appliedFilters.tag !== "all") {
                params.set("tagSlug", appliedFilters.tag);
            }
            if (isArticle && appliedFilters.author !== "all") {
                params.set("authorSlug", appliedFilters.author);
            }
            appendDateRangeParams(params, appliedFilters.date);
            if (appliedFilters.sort) {
                params.set("sortBy", appliedFilters.sort);
            }

            const res = await fetch(`/api/wordpress-posts?${params.toString()}`);
            if (!res.ok) {
                console.error(`Erreur lors du lazy loading: ${res.status}`);
                return;
            }

            const data = await res.json();
            const newNodes: WordPressPost[] = data.nodes || [];

            setPosts((prev) => {
                const existingSlugs = new Set(prev.map((p) => p.slug));
                const filteredNew = newNodes.filter(
                    (p) => !existingSlugs.has(p.slug)
                );
                return [...prev, ...filteredNew];
            });

            setPageInfo(
                data.pageInfo || { endCursor: null, hasNextPage: false }
            );
        } catch (err) {
            console.error("Erreur de lazy loading:", err);
        } finally {
            setIsLoadingMore(false);
        }
    }, [
        pageInfo.hasNextPage,
        pageInfo.endCursor,
        isLoading,
        isLoadingMore,
        categoryId,
        appliedFilters,
        isArticle,
    ]);

    // Native IntersectionObserver API for Lazy Loading
    React.useEffect(() => {
        const target = observerTargetRef.current;
        if (!target || !pageInfo.hasNextPage || isLoading || isLoadingMore) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting) {
                    loadMore();
                }
            },
            {
                root: null,
                rootMargin: "300px",
                threshold: 0.1,
            }
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [pageInfo.hasNextPage, isLoading, isLoadingMore, loadMore]);

    return (
        <section className="flex w-full flex-col items-center gap-8 px-4 py-10 md:gap-10 md:pb-20 lg:px-12 xl:px-48">
            <div className="mt-12" />

            <div className="w-full text-center">
                <TitleCard>{title}</TitleCard>
            </div>

            {/* Neobrutalism Search & Filters organism with validation and global spring animation */}
            <div className="w-full">
                <WordPressPostFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    categories={allCategories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    tags={availableTags}
                    selectedTag={selectedTag}
                    onTagChange={setSelectedTag}
                    authors={allAuthors}
                    selectedAuthor={selectedAuthor}
                    onAuthorChange={setSelectedAuthor}
                    selectedStartDate={selectedDate?.from}
                    onStartDateChange={(date) =>
                        setSelectedDate((current) =>
                            date || current?.to
                                ? { from: date, to: current?.to }
                                : undefined
                        )
                    }
                    selectedEndDate={selectedDate?.to}
                    onEndDateChange={(date) =>
                        setSelectedDate((current) =>
                            current?.from || date
                                ? { from: current?.from, to: date }
                                : undefined
                        )
                    }
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    isArticle={isArticle}
                    onSubmit={handleValidateFilters}
                    onReset={handleResetFilters}
                    isLoading={isLoading}
                    canReset={canReset}
                    totalLoadedCount={posts.length}
                />
            </div>

            {/* Posts Grid */}
            <div className="w-full">
                {isLoading ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center gap-4 rounded-base border-2 border-border bg-secondary-background p-12 text-center shadow-shadow"
                    >
                        <Loader2 className="size-8 animate-spin text-main-foreground" />
                        <p className="text-base font-heading">
                            Recherche des {isArticle ? "articles" : "projets"} en cours...
                        </p>
                    </motion.div>
                ) : posts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {posts.map((post) => (
                            <PostCard
                                key={post.slug}
                                badgeLabel={badgeLabel}
                                description={getWordPressPostDescription(post)}
                                href={
                                    basePath === "/articles"
                                        ? `${basePath}/${post.slug}`
                                        : `/personalProjects/${post.slug}`
                                }
                                media={getWordPressPostCoverMedia(post)}
                                title={post.title}
                                githubUrl={
                                    basePath === "/personalProjects"
                                        ? post.personalProject?.github
                                        : null
                                }
                                demoUrl={
                                    basePath === "/personalProjects"
                                        ? post.personalProject?.demonstrationWebsite
                                        : null
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        transition={{
                            duration: 0.4,
                            scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 },
                        }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        className="flex flex-col items-center justify-center gap-4 rounded-base border-2 border-border bg-secondary-background p-10 text-center shadow-shadow"
                    >
                        <p className="text-lg font-heading">
                            Aucun {isArticle ? "article" : "projet"} ne correspond à vos critères.
                        </p>
                        <p className="text-sm font-base text-foreground/70">
                            Essayez de modifier votre recherche ou vos filtres.
                        </p>
                        {canReset && (
                            <Button
                                variant="default"
                                onClick={handleResetFilters}
                                className="cursor-pointer mt-2"
                            >
                                <RotateCcw className="size-4 mr-2" />
                                Réinitialiser les filtres
                            </Button>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Lazy loading Sentinel & Feedback */}
            {pageInfo.hasNextPage && (
                <div
                    ref={observerTargetRef}
                    className="flex w-full items-center justify-center py-6"
                >
                    <div className="flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-4 py-2 text-xs font-heading shadow-shadow">
                        {isLoadingMore ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                <span>Chargement de la suite...</span>
                            </>
                        ) : (
                            <span>Faites défiler pour charger plus...</span>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
