import fetchProjectInfo from "@/src/fetch/fetchProjectInfo";
import {notFound} from "next/navigation";
import ProjectInfoSection from "@/src/components/organisms/ProjectInfoSection";
import Header from "@/src/components/organisms/Header/Header";
import {Metadata} from "next";

export async function generateMetadata(
    { params }: { params: { personalProjectId: string } }
): Promise<Metadata> {

    const { personalProjectId } = params;
    const projectInfo = await fetchProjectInfo(personalProjectId);

    if (!projectInfo) {
        return {
            title: "Projet introuvable",
            description: "Ce projet n'existe pas.",
        };
    }

    return {
        title: `${projectInfo.projectName} – Mes projets`,
        description:
            projectInfo.description?.slice(0, 150) ||
            "Découvrez ce projet.",

        openGraph: {
            title: projectInfo.projectName,
            description: projectInfo.description,
            url: `https://thibaultfalezan.fr/personalProjects/${personalProjectId}`,
            type: "article",
            images: [
                {
                    url: projectInfo.imageLink || "",
                    width: 1200,
                    height: 630,
                },
            ],
        },

        alternates: {
            canonical: `https://thibaultfalezan.fr/personalProjects/${personalProjectId}`,
        },
    };
}

export default async function Page({ params }: { params: Promise<{ personalProjectId: string }> }) {
    const { personalProjectId } = await params;

    const projectInfo = await fetchProjectInfo(personalProjectId);

    if (!projectInfo) {
        notFound();
        return;
    }

    return (
        <>
            <Header navTitle={"Mes projets"} navLink={"/#mes-projets"}/>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CreativeWork",
                        name: projectInfo.projectName,
                        description: projectInfo.description,
                        image: projectInfo.imageLink,
                        url: `https://thibaultfalezan.com/projets/${personalProjectId}`,
                        author: {
                            "@type": "Person",
                            name: "Thibault Falézan",
                            url: "https://thibaultfalezan.com"
                        },
                        dateCreated: projectInfo.projectName,
                        genre: "Projet informatique / Portfolio",
                        keywords: projectInfo.tags || []
                    }),
                }}
            />

            <ProjectInfoSection projectInfo={projectInfo} />
        </>
    );
}