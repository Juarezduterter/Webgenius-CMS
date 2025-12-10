# Webgenius CMS (Payload multi-tenant)

Projet Payload CMS multi-tenant (Node.js + TypeScript) prêt pour Railway.

## Prérequis
- Node.js 20+
- PostgreSQL (URL via `DATABASE_URL`)

## Variables d'environnement
Créer un fichier `.env` local avec au minimum :

```
PAYLOAD_SECRET=changeme
DATABASE_URL=postgres://user:pass@host:5432/db
PUBLIC_URL=http://localhost:3000
FRONTEND_ORIGINS=http://localhost:3000
```

## Installation et lancement local
```bash
npm install
npm run dev
```
- Admin : `/admin`
- API REST/GraphQL : `/api`

## Déploiement Railway (backend uniquement)
1. Pousser ce repo sur Git.
2. Créer un nouveau projet Railway, connecter le dépôt.
3. Ajouter un service PostgreSQL et noter la `DATABASE_URL`.
4. Dans `Variables` du service, définir :
   - `PAYLOAD_SECRET`
   - `DATABASE_URL`
   - `PUBLIC_URL` (ex : `https://<nom>.up.railway.app`)
   - `FRONTEND_ORIGINS` (ex : `https://site-a.vercel.app,https://site-b.ionos.fr`)
5. Build & Deploy : Railway lancera `npm install`, `npm run build`, puis `npm start` (défini dans `package.json`).

## Modèle multi-tenant
Collections principales :
- **sites** : `name`, `slug` (unique).
- **users** (auth) : `email` + `role` (`admin` ou `client`) + `site` (relationship obligatoire).
- **pages** : `site` (relationship obligatoire), `title`, `slug`, `content` (richText).

### Accès et isolation
- Lecture (`read`) des pages : public.
- Création / mise à jour / suppression :
  - admin : accès complet.
  - client : limité aux documents dont le champ `site` correspond à son site.

### Exemple d'appel API côté frontend
Filtrer par site via le slug :
```
GET /api/pages?where[site.slug][equals]={SITE_SLUG}
```

## Création d'utilisateurs client
1. Créer un `site` avec `name` et `slug`.
2. Dans `users`, créer un utilisateur avec `role=client` et associer le champ `site` au site voulu.
3. Se connecter à l'admin avec cet utilisateur : il ne verra/modifiera que les contenus de son site.

## Notes supplémentaires
- `PUBLIC_URL` sert à générer les liens de l'admin en production.
- `FRONTEND_ORIGINS` contrôle CORS/CSRF pour sécuriser les appels depuis vos fronts (Vercel, IONOS, etc.).
- L'application écoute `PORT` (défaut `3000`).
