import {databases} from "@/api/appWriteConnection";
import {PersonalProjectType} from "@/src/types/PersonalProjectType";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_PROJECTS_ID;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PERSONAL_PROJECTS_ID;

async function fetchProjectList() {
    const documents: PersonalProjectType[] = [];

    if (!DATABASE_ID || !COLLECTION_ID) {
      console.error("fetchProjectList -> impossible de récupérer les variables d'environnement !");
      throw "Impossible de récupérer les variables d'environnement !";
    }


    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID
        );
        response.documents.forEach(document => {
            const personalProject: PersonalProjectType = {
                $id: document.$id,
                codeLink: document.codeLink,
                demoLink: document.demoLink,
                description: document.description,
                documentation: document.documentation,
                endDate: new Date(document.endDate),
                projectName: document.projectName,
                startDate: new Date(document.startDate),
                tags: document.tags,
                imageLink: document.imageLink,
            }
            documents.push(personalProject);
        })
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }

    return documents;

}

export default fetchProjectList;