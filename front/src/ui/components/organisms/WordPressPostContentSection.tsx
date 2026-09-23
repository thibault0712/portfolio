import { type WordPressPost } from "@/src/models/WordPressPost";
import WordPressContent from "@/src/ui/components/atoms/custom/WordPressContent";
import { Button } from "@/src/ui/components/atoms/shadcnUI/button";
import Link from "next/link";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import TagsList from "@/src/ui/components/molecules/TagsList";
import IllustrationMediaCard from "@/src/ui/components/atoms/custom/IllustrationMediaCard";
import { getWordPressPostCoverMedia } from "@/src/lib/wordpress";

type WordPressContentSectionProps = {
    post: WordPressPost;
};

const WordPressPostContentSection = ({ post }: WordPressContentSectionProps) => {
    const presentationMedia = getWordPressPostCoverMedia(post);
    const isPersonalProject = post.categories?.nodes?.map(c => c.slug).includes("personal_projects");

    return (
        <section className="bg-secondary-background px-4 py-4 pt-28 w-full min-h-screen space-y-6 flex flex-col md:py-24 lg:px-12 xl:px-72">

            {
                presentationMedia &&
                <IllustrationMediaCard projectTitle={post.title} wordpressMediaItem={presentationMedia} />
            }

            {
                (post.personalProject?.github || post.personalProject?.demonstrationWebsite) && (
                    <div className="flex flex-wrap items-center gap-3">
                        {post.personalProject?.github && (
                            <Link href={post.personalProject.github} target="_blank" rel="noopener noreferrer">
                                <Button className="cursor-pointer bg-blue-400">
                                    <FaGithub /> Code
                                </Button>
                            </Link>
                        )}

                        {post.personalProject?.demonstrationWebsite && (
                            <Link href={post.personalProject.demonstrationWebsite} target="_blank" rel="noopener noreferrer">
                                <Button className="cursor-pointer bg-yellow-400">
                                    <FaExternalLinkAlt /> Demo
                                </Button>
                            </Link>
                        )}
                    </div>
                )
            }

            {isPersonalProject && (
                <div className="space-y-4">
                    {post.personalProject?.startedAt && <p><span className="font-bold">Débuté le :</span> {new Date(post.personalProject.startedAt).toLocaleDateString()}</p>}
                    {post.personalProject?.endedAt && <p><span className="font-bold">Arrêté le :</span> {new Date(post.personalProject.endedAt).toLocaleDateString()}</p>}
                    <TagsList
                        tags={post.tags.nodes.map((tag) => tag.name)}
                        showTagsText={true}
                    />
                </div>
            )}

            {
                !isPersonalProject && (
                    <div className="space-y-4">
                        {post.date && <p><span className="font-bold">Publié le :</span> {new Date(post.date).toLocaleDateString("fr-FR")}</p>}
                        {post.modified && <p><span className="font-bold">Dernière modification :</span> {new Date(post.modified).toLocaleDateString("fr-FR")}</p>}
                        {post.author?.node?.name && <p><span className="font-bold">Auteur :</span> {post.author.node.name}</p>}
                        <TagsList
                            tags={post.tags.nodes.map((tag) => tag.name)}
                            showTagsText={true}
                        />
                    </div>
                )
            }

            <WordPressContent html={post.content} />

        </section>
    );
};

export default WordPressPostContentSection;