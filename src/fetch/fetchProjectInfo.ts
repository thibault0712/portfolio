import {databases} from "@/api/appWriteConnection";
import {PersonalProjectType} from "@/src/types/PersonalProjectType";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_PROJECTS_ID;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PERSONAL_PROJECTS_ID;

async function fetchProjectInfo(projectId: string):Promise<PersonalProjectType | null> {
    let document: PersonalProjectType | null = null;

    if (!DATABASE_ID || !COLLECTION_ID) {
        console.error("fetchProjectList -> impossible de récupérer les variables d'environnement !");
        throw "Impossible de récupérer les variables d'environnement !";
    }

    try {
        const response = await databases.getDocument(
            {
                databaseId: DATABASE_ID,
                collectionId: COLLECTION_ID,
                documentId: projectId,
            }
        )

        document = {
            $id: response.$id,
            $updatedAt: new Date(response.$updatedAt),
            codeLink: response.codeLink,
            demoLink: response.demoLink,
            description: response.description,
            documentation: response.documentation,
            endDate: response.endDate,
            imageLink: response.imageLink,
            projectName: response.projectName,
            startDate: response.startDate,
            tags: response.tags,
        }

    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }

    return document;

}

export default fetchProjectInfo;