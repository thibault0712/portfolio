# Conventions de commits

Les commits suivent le format **Conventional Commits** pour que Release Please puisse déterminer la prochaine version et générer le changelog.

```text
<type>[scope][!]: <description courte>

[corps facultatif]

[pied(s) facultatif(s)]
```

- `type` décrit le changement (`feat`, `fix`, `perf`, `docs`, `refactor`, `test`, `chore`, etc.).
- `scope` est facultatif et précise la zone touchée, par exemple `feat(blog): ...`.
- La description commence par une minuscule, reste concise et n’a pas de point final.
- Écris les messages en anglais pour garder un historique homogène.

## Effet sur les versions

- `feat: add project filtering` prépare une version mineure (`1.0.0` → `1.1.0`).
- `fix: correct the mobile navigation` prépare une version corrective (`1.0.0` → `1.0.1`).
- `perf: reduce image loading time` prépare aussi une version corrective.
- `docs: update setup instructions`, `chore: update dependencies` et `refactor: simplify post fetching` seuls ne déclenchent pas de release.
- Pour un changement incompatible, ajoute `!` après le type (`feat!: ...`) ou utilise un pied `BREAKING CHANGE: ...`. Cela prépare une version majeure (`1.0.0` → `2.0.0`).

Exemple de breaking change avec une explication :

```text
feat(api)!: replace the legacy projects endpoint

BREAKING CHANGE: clients must now query projects through WordPress GraphQL.
```

Garde un commit concentré sur un changement cohérent. Une pull request peut contenir plusieurs commits ; Release Please se base sur leurs messages pour ouvrir une pull request de release après leur fusion dans `main`.
