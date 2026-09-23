# Portfolio Front

## Image Docker publiée sur GHCR

Le workflow GitHub Actions du dépôt construit l'image depuis `front/Dockerfile` et la publie sur GitHub Container Registry :

```sh
docker pull ghcr.io/thibault0712/portfolio:latest
```

Un push sur `main` met à jour `latest` et publie également un tag basé sur le commit (`sha-…`). Les tags Git commençant par `v` sont publiés comme versions, par exemple `ghcr.io/thibault0712/portfolio:v1.0.0`. Les pull requests vers `main` vérifient la construction sans publier d'image.

Le workflow utilise `GITHUB_TOKEN` pour publier le package. Si le package est privé, configurez son accès dans les paramètres GitHub Packages.

## Versionnage et releases

Le projet suit [Semantic Versioning](https://semver.org/) avec [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat: ...` prépare une version mineure (`1.0.0` → `1.1.0`).
- `fix: ...` prépare une version corrective (`1.0.0` → `1.0.1`).
- `feat!: ...` ou un pied de commit `BREAKING CHANGE: ...` prépare une version majeure (`1.0.0` → `2.0.0`).
- `docs:`, `chore:`, `refactor:` et `test:` seuls ne publient pas de nouvelle version.

Release Please ouvre une pull request de release sur chaque changement versionnable dans `main`. La fusion de cette PR crée la release GitHub et publie aussi l'image GHCR sous `1.1.0` et `v1.1.0`, ainsi que `latest`. La version de départ du projet est `1.0.0`.

Pour initialiser la ligne de versions, fusionne d'abord les changements de cette version, puis crée sur GitHub une release **v1.0.0** à partir du commit correspondant. Le workflow attend cette release de base avant d'automatiser les suivantes. Dans les paramètres du dépôt, active aussi **Settings → Actions → General → Allow GitHub Actions to create and approve pull requests**, afin que Release Please puisse ouvrir ses PR de release.

## Setup local

1. Copier `.env.example` vers `.env`.
2. À la racine du dépôt, copier `.env.example` vers `.env` et remplacer les deux mots de passe locaux.
3. Vérifier que WordPress est accessible sur `WORDPRESS_URL`.
4. Lancer `npm run dev`.

Le `.env` à la racine configure MariaDB et WordPress dans Docker Compose. Celui de `front/` configure l'application Next.js. Ces fichiers locaux sont ignorés par Git et exclus du contexte Docker.

## Variables WordPress

- `WORDPRESS_URL` : URL du site WordPress local ou distant.
- `WORDPRESS_GRAPHQL_URL` : endpoint GraphQL, dérivé automatiquement si vide.
- `WORDPRESS_CATEGORY_PROJECTS_ID` : catégorie utilisée pour la section Projets personnels.
- `WORDPRESS_CATEGORY_BLOG_ID` : catégorie utilisée pour la section Blog.
- `MAX_ARTICLES_PROJECTS` : nombre maximal de cartes affichées sur l’accueil pour les projets.
- `MAX_ARTICLES_BLOG` : nombre maximal de cartes affichées sur l’accueil pour le blog.
- `WORDPRESS_REVALIDATE_SECONDS` : durée de revalidation des requêtes WordPress.

## Notes

- Le blog et les projets personnels sont rendus via WPGraphQL.
- Le contenu WordPress est sanitizé avant affichage.
- Les anciennes intégrations Appwrite ont été retirées du chemin de build.
