import { Client, Databases, ID } from 'appwrite';

const client = new Client();
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;

if (!projectId || !endpoint) {
    // Option 1: Lever une erreur pour arrêter l'application si les clés sont manquantes
    throw new Error("Les variables d'environnement Appwrite sont manquantes.");
}

client.setProject(projectId);
client.setEndpoint(endpoint);

const databases = new Databases(client);

export { ID, databases, client };