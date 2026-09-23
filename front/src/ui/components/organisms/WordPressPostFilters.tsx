"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Search, RotateCcw, Check, Loader2, X } from "lucide-react";
import { Input } from "@/src/ui/components/atoms/shadcnUI/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/ui/components/atoms/shadcnUI/select";
import { DatePicker } from "@/src/ui/components/atoms/shadcnUI/date-picker";
import { Button } from "@/src/ui/components/atoms/shadcnUI/button";
import { Badge } from "@/src/ui/components/atoms/shadcnUI/badge";

export type SortOption = "date-desc" | "date-asc" | "title-asc" | "title-desc";

export type FilterOption = {
    slug: string;
    name: string;
};

type WordPressPostFiltersProps = {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    categories: FilterOption[];
    selectedCategory: string;
    onCategoryChange: (categorySlug: string) => void;
    tags: FilterOption[];
    selectedTag: string;
    onTagChange: (tagSlug: string) => void;
    authors?: FilterOption[];
    selectedAuthor?: string;
    onAuthorChange?: (authorSlug: string) => void;
    selectedStartDate: Date | undefined;
    onStartDateChange: (date: Date | undefined) => void;
    selectedEndDate: Date | undefined;
    onEndDateChange: (date: Date | undefined) => void;
    sortBy: SortOption;
    onSortChange: (sort: SortOption) => void;
    isArticle?: boolean;
    onSubmit: () => void;
    onReset: () => void;
    isLoading: boolean;
    canReset: boolean;
    totalLoadedCount: number;
};

export default function WordPressPostFilters({
    searchQuery,
    onSearchChange,
    categories,
    selectedCategory,
    onCategoryChange,
    tags,
    selectedTag,
    onTagChange,
    authors,
    selectedAuthor = "all",
    onAuthorChange,
    selectedStartDate,
    onStartDateChange,
    selectedEndDate,
    onEndDateChange,
    sortBy,
    onSortChange,
    isArticle = false,
    onSubmit,
    onReset,
    isLoading,
    canReset,
    totalLoadedCount,
}: WordPressPostFiltersProps) {
    // Rule 1: "Si je n'ai que une seule catégorie possible sur la page je n'affiche pas la catégorie."
    const showCategoryFilter = categories.length > 1;

    // Rule 2: "Si dans la catégorie x il y a que un seul tag je n'affiche pas de filtre par tag."
    const showTagFilter = tags.length > 1;

    // Rule 3: Author filter for articles if more than 1 author
    const showAuthorFilter = isArticle && (authors?.length ?? 0) > 1;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            transition={{
                duration: 0.4,
                scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 },
            }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            className="w-full"
        >
            <form
                onSubmit={handleSubmit}
                className="w-full space-y-4 rounded-base border-2 border-border bg-background p-4 sm:p-6 shadow-shadow"
            >
                {/* Top row: Search Bar, Result Count & Action Buttons (Aligned on the same line) */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/50 pointer-events-none" />
                        <Input
                            type="text"
                            placeholder="Rechercher par mot-clé, sujet..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9 pr-9"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => onSearchChange("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-foreground/50 hover:text-foreground cursor-pointer rounded-base transition-colors"
                                title="Effacer le texte"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
                        {/* Badge with same height as buttons (h-10) */}
                        <Badge
                            variant="neutral"
                            className="h-10 px-4 text-sm font-heading flex items-center justify-center shrink-0 border-2 border-border shadow-shadow"
                        >
                            {totalLoadedCount} {isArticle ? "articles" : "projets"}
                        </Badge>

                        {/* Reset button: Identical style, height and variant to Valider button */}
                        {canReset && (
                            <Button
                                type="button"
                                variant="default"
                                onClick={onReset}
                                disabled={isLoading}
                                className="cursor-pointer font-heading text-sm shrink-0"
                                title="Réinitialiser tous les filtres"
                            >
                                <RotateCcw className="size-4 mr-1.5" />
                                Réinitialiser
                            </Button>
                        )}

                        {/* Validate button */}
                        <Button
                            type="submit"
                            variant="default"
                            disabled={isLoading}
                            className="cursor-pointer font-heading text-sm shrink-0"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="size-4 mr-1.5 animate-spin" />
                                    Chargement...
                                </>
                            ) : (
                                <>
                                    <Check className="size-4 mr-1.5" />
                                    Valider
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Filter controls row */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                    {/* Category selector (conditional) */}
                    {showCategoryFilter && (
                        <div className="w-full sm:w-48">
                            <Select
                                value={selectedCategory}
                                onValueChange={(val) => onCategoryChange(val)}
                            >
                                <SelectTrigger className="w-full bg-secondary-background text-foreground h-10">
                                    <SelectValue placeholder="Catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes les catégories</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.slug} value={cat.slug}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Tag selector (conditional) */}
                    {showTagFilter && (
                        <div className="w-full sm:w-48">
                            <Select
                                value={selectedTag}
                                onValueChange={(val) => onTagChange(val)}
                            >
                                <SelectTrigger className="w-full bg-secondary-background text-foreground h-10">
                                    <SelectValue placeholder="Tag" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les tags</SelectItem>
                                    {tags.map((tag) => (
                                        <SelectItem key={tag.slug} value={tag.slug}>
                                            {tag.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Author selector (for articles) */}
                    {showAuthorFilter && onAuthorChange && (
                        <div className="w-full sm:w-48">
                            <Select
                                value={selectedAuthor}
                                onValueChange={(val) => onAuthorChange(val)}
                            >
                                <SelectTrigger className="w-full bg-secondary-background text-foreground h-10">
                                    <SelectValue placeholder="Auteur" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les auteurs</SelectItem>
                                    {authors?.map((author) => (
                                        <SelectItem key={author.slug} value={author.slug}>
                                            {author.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Date range pickers */}
                    <div className="w-full sm:w-auto space-y-1.5">
                        <label className="block text-sm font-heading" htmlFor="filter-start-date">
                            Date de début
                        </label>
                        <DatePicker
                            date={selectedStartDate}
                            setDate={onStartDateChange}
                            placeholder="Date de début"
                            id="filter-start-date"
                        />
                    </div>

                    <div className="w-full sm:w-auto space-y-1.5">
                        <label className="block text-sm font-heading" htmlFor="filter-end-date">
                            Date de fin
                        </label>
                        <DatePicker
                            date={selectedEndDate}
                            setDate={onEndDateChange}
                            placeholder="Date de fin"
                            id="filter-end-date"
                            disabled={selectedStartDate ? { before: selectedStartDate } : undefined}
                        />
                    </div>

                    {/* Sort selector */}
                    <div className="w-full sm:w-48 sm:ml-auto space-y-1.5">
                        <label className="block text-sm font-heading" htmlFor="filter-sort">
                            Trier par
                        </label>
                        <Select
                            value={sortBy}
                            onValueChange={(val) => onSortChange(val as SortOption)}
                        >
                            <SelectTrigger id="filter-sort" className="w-full bg-secondary-background text-foreground h-10">
                                <SelectValue placeholder="Trier par" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="date-desc">Plus récents</SelectItem>
                                <SelectItem value="date-asc">Plus anciens</SelectItem>
                                <SelectItem value="title-asc">Titre (A à Z)</SelectItem>
                                <SelectItem value="title-desc">Titre (Z à A)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </form>
        </motion.div>
    );
}
