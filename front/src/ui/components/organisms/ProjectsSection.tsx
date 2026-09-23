import TitleCard from "@/src/ui/components/molecules/TitleCard";
import { fetchWordPressProjectsPreview } from "@/src/api/fetch/fetchWordPressPosts";
import PostCard from "@/src/ui/components/molecules/PostCard";
import { MAX_ARTICLES_PROJECTS } from "@/src/config/wordpress";
import { getWordPressPostDescription } from "@/src/lib/wordpress";
import { getWordPressPostCoverMedia } from "@/src/lib/wordpress";
import Link from "next/link";
import { Button } from "@/src/ui/components/atoms/shadcnUI/button";


const ProjectsSection = async () => {
    const projects = await fetchWordPressProjectsPreview(MAX_ARTICLES_PROJECTS)

    if (projects.nodes.length <= 0) {
        return null
    }

    return (
        <section id={"mes-projets"} className="flex flex-col items-center justify-center gap-8 md:gap-14 w-full px-4 py-10 md:pb-20 lg:px-12 xl:px-48">

            <div className={"w-full text-center"}>
                <TitleCard>Mes projets</TitleCard>
            </div>

            <div
                className="w-full"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {projects.nodes.map((project) => (
                        <PostCard title={project.title}
                            description={getWordPressPostDescription(project)}
                            key={project.slug}
                            href={`/personalProjects/${project.slug}`}
                            badgeLabel={"Projet"}
                            media={getWordPressPostCoverMedia(project)}
                            githubUrl={project.personalProject?.github}
                            demoUrl={project.personalProject?.demonstrationWebsite}
                        />
                    ))}
                </div>
            </div>

            {projects.hasMore && (
                <div className="w-full text-center">
                    <Link href="/personalProjects">
                        <Button size={"lg"} className="cursor-pointer text-base">Voir plus</Button>
                    </Link>
                </div>
            )}
        </section>
    );
};


export default ProjectsSection;