"use client"

import {PersonalProjectType} from "@/src/types/PersonalProjectType";
import ImageCard from "@/src/components/atoms/ImageCard";
import {Button} from "@/components/ui/button";
import {FaExternalLinkAlt, FaGithub} from "react-icons/fa";
import TagsList from "@/src/components/molecules/TagsList";
import MarkdownConversion from "@/src/components/atoms/MarkdownConversion";

type ProjectInfoSectionProps = {
    projectInfo: PersonalProjectType;
}


const ProjectInfoSection = (projectInfoSection: ProjectInfoSectionProps) => {

    const projectInfo = projectInfoSection.projectInfo;

    return (

        <section id={"Mes projets"} className={"bg-secondary-background px-4 py-4 md:py-24 lg:px-12 xl:px-72 w-full min-h-screen pt-28 space-y-4 flex flex-col"}>
            <ImageCard projectTitle={projectInfo.projectName} imageLink={projectInfo.imageLink}/>

            <div className={"flex flex-wrap gap-3 items-center"}>
                { projectInfo.codeLink && (
                    <Button onClick={() => window.open(projectInfo.codeLink!)} className={"cursor-pointer bg-blue-400"} > <FaGithub/> Code</Button>
                ) }

                { projectInfo.demoLink && (
                    <Button onClick={() => window.open(projectInfo.demoLink!)} className={"cursor-pointer bg-yellow-400"} > <FaExternalLinkAlt/> Demo</Button>
                ) }
            </div>

            <TagsList tags={projectInfo.tags} showTagsText={true}/>

            <div className={"space-y-4"}>
                <p><span className="font-bold">Débuté le :</span> {new Date(projectInfo.startDate).toLocaleDateString()}</p>
                <p><span className="font-bold">Arrêté le :</span> {new Date(projectInfo.endDate).toLocaleDateString()}</p>
            </div>

            <MarkdownConversion>
                {projectInfo.documentation}
            </MarkdownConversion>

        </section>

    )
}

export default ProjectInfoSection;