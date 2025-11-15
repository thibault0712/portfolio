import TitleCard from "@/src/components/molecules/TitleCard";
import ProjectCard from "@/src/components/molecules/ProjectCard";
import fetchProjectList from "@/src/fetch/fetchProjectList";


const ProjectsSection = async () => {
    const projects = await fetchProjectList()

    return (
        <section id={"mes-projets"} className="flex flex-col items-center justify-center gap-8 md:gap-14 w-full px-4 py-10 md:pb-20 lg:px-12 xl:px-48">

            <div className={"w-full text-center"}>
                <TitleCard>Mes projets</TitleCard>
            </div>

            <div
                className="w-full"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <ProjectCard title={project.projectName}
                                     description={project.description}
                                     tags={project.tags}
                                     codeLink={project.codeLink}
                                     demoLink={project.demoLink}
                                     imageLink={project.imageLink}
                                     key={project.$id}
                                     projectId={project.$id}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};


export default ProjectsSection;