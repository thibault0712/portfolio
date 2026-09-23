import TitleCard from "@/src/ui/components/molecules/TitleCard";
import { fetchWordPressBlogPreview } from "@/src/api/fetch/fetchWordPressPosts";
import { MAX_ARTICLES_BLOG } from "@/src/config/wordpress";
import PostCard from "@/src/ui/components/molecules/PostCard";
import { getWordPressPostDescription } from "@/src/lib/wordpress";
import { getWordPressPostCoverMedia } from "@/src/lib/wordpress";
import Link from "next/link";
import { Button } from "@/src/ui/components/atoms/shadcnUI/button";

const BlogSection = async () => {
    const blog = await fetchWordPressBlogPreview(MAX_ARTICLES_BLOG);

    if (blog.nodes.length <= 0) {
        return null
    }

    return (
        <section id="mes-articles" className="flex w-full flex-col items-center justify-center gap-8 px-4 py-10 md:gap-14 md:pb-20 lg:px-12 xl:px-48">
            <div className="w-full text-center">
                <TitleCard>Mes articles</TitleCard>
            </div>

            <div className="w-full">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {blog.nodes.map((post) => (
                        <PostCard
                            key={post.slug}
                            title={post.title}
                            description={getWordPressPostDescription(post)}
                            href={`/articles/${post.slug}`}
                            badgeLabel="Article"
                            media={getWordPressPostCoverMedia(post)}
                        />
                    ))}
                </div>
            </div>

            {blog.hasMore && (
                <div className="w-full text-center">
                    <Link href="/articles">
                        <Button variant="neutral">Voir plus</Button>
                    </Link>
                </div>
            )}
        </section>
    );
};

export default BlogSection;