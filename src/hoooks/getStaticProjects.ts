import fetchProjectList from "@/src/fetch/fetchProjectList";

export async function getStaticProjects() {
    const projects = await fetchProjectList();
    return { projects };
}
