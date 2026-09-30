import Header from "@/src/ui/components/organisms/Header/Header";
import WordPressPaginatedList from "@/src/ui/components/organisms/WordPressPaginatedList";
import { type WordPressCategory, type WordPressPostConnectionPageInfo, type WordPressPost } from "@/src/models/WordPressPost";

type WordPressSectionScreenProps = {
    badgeLabel: string;
    basePath: string;
    categoryId: number;
    navTitle: string;
    posts: WordPressPost[];
    title: string;
    pageInfo?: WordPressPostConnectionPageInfo;
    categories?: WordPressCategory[];
};

export default function WordPressSectionScreen({
    badgeLabel,
    basePath,
    categoryId,
    navTitle,
    posts,
    title,
    pageInfo,
    categories,
}: WordPressSectionScreenProps) {
    return (
        <div className="bg-[linear-gradient(to_right,#8080804D_1px,transparent_1px),linear-gradient(to_bottom,#80808090_1px,transparent_1px)] bg-size-[60px_60px] bg-secondary-background min-h-screen">
            <Header navTitle={navTitle} navLink={basePath} />
            <WordPressPaginatedList
                badgeLabel={badgeLabel}
                basePath={basePath}
                categoryId={categoryId}
                initialPosts={posts}
                initialPageInfo={pageInfo}
                categories={categories}
                title={title}
            />
        </div>
    );
}
