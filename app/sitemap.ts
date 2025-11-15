import fetchProjectList from "@/src/fetch/fetchProjectList";
import {PersonalProjectType} from "@/src/types/PersonalProjectType";

export default async function sitemap() {
    const baseUrl = "https://portfolio.thibaultfalezan.com";

    const routes = ["", "/#a-propos", "/#mes-experiences", "/#mes-projets"].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        priority: 0.9,
    }));


    const projects = await fetchProjectList();

    const projectRoutes = projects.map((project: PersonalProjectType) => ({
        url: `${baseUrl}/personalProjects/${project.$id}`,
        lastModified: new Date(),
        priority: 0.8,
        updatedAt: new Date(project.$updatedAt),
        images: project.imageLink ? [project.imageLink.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")] : [],
    }));

    return [...routes, ...projectRoutes];
}