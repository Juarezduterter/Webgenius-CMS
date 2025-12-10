# Webgenius CMS – Payload multi-tenant

CMS headless multi-tenant basé sur Payload CMS (Node.js + TypeScript), conçu pour gérer plusieurs sites web front (Vercel, IONOS, etc.) depuis une seule instance backend, avec isolation stricte des accès par site. Prêt pour un déploiement sur Railway avec MongoDB.

---

## Prérequis

* Node.js 20+
* Base de données MongoDB (via `MONGODB_URI`, fournie par Railway)

---

## Variables d’environnement

Créer un fichier `.env` (en local) ou définir ces variables dans Railway :

```env
PAYLOAD_SECRET=changeme
MONGODB_URI=mongodb+srv://user:pass@cluster/db
PUBLIC_URL=http://localhost:3000
FRONTEND_ORIGINS=http://localhost:3000
```

**Description :**

* `PAYLOAD_SECRET` : secret interne Payload (JWT, auth, etc.)
* `MONGODB_URI` : connexion MongoDB (Railway)
* `PUBLIC_URL` : URL publique de l’instance (utilisée par l’admin)
* `FRONTEND_ORIGINS` : domaines autorisés (CORS / CSRF), séparés par virgule

---

## Installation et lancement local

```bash
npm install
npm run dev
```

* Admin : `/admin`
* API REST / GraphQL : `/api`

---

## Déploiement sur Railway (backend uniquement)

1. Pousser ce dépôt Git.
2. Créer un nouveau projet Railway et importer le repository.
3. Ajouter un **service MongoDB** (Railway Plugin).
4. Vérifier que `MONGODB_URI` est bien présent dans les variables du service.
5. Ajouter les variables suivantes :

   * `PAYLOAD_SECRET`
   * `PUBLIC_URL` (ex : `https://mon-cms.up.railway.app`)
   * `FRONTEND_ORIGINS` (ex : `https://site-a.vercel.app,https://site-b.ionos.fr`)
6. Railway exécutera automatiquement :

   * `npm install`
   * `npm run build`
   * `npm start`

L’application écoute le port défini par `PORT` (automatiquement fourni par Railway).

---

## Modèle multi-tenant

### Collections principales

* **sites**

  * `name` (text, requis)
  * `slug` (text, requis, unique)

* **users** (auth activée)

  * `email`
  * `password`
  * `role` : `admin` ou `client`
  * `site` : relationship obligatoire vers `sites`

* **pages**

  * `site` : relationship vers `sites` (obligatoire)
  * `title`
  * `slug`
  * `content` (richText)

---

## Accès et isolation des données

* **Lecture (`read`)** : publique (accessible aux frontends)
* **Création / modification / suppression** :

  * `admin` : accès complet à tous les sites
  * `client` : limité aux documents liés à son site uniquement

Chaque utilisateur client ne peut ni voir ni modifier les contenus des autres sites.

---

## Consommation API côté frontend

Filtrer les contenus par site via le `slug` :

```http
GET /api/pages?where[site.slug][equals]={SITE_SLUG}
```

Exemple :

```http
GET /api/pages?where[site.slug][equals]=boucherie-dupont
```

Compatible avec :

* Next.js (Vercel)
* sites hébergés sur IONOS
* tout frontend pouvant consommer une API REST

---

## Création d’un site et d’un utilisateur client

1. Créer un document dans la collection **sites** (`name`, `slug`)
2. Créer un utilisateur dans **users** :

   * `role = client`
   * `site = le site concerné`
3. Connexion à `/admin` avec cet utilisateur :

   * il ne voit que les contenus de son site

---

## Notes

* Une seule instance Payload peut gérer un nombre illimité de sites
* Ajout d’un nouveau site = pas besoin d’un nouveau CMS
* Le modèle est pensé pour une **agence / SaaS CMS mutualisé**

---

## Ce que vous devez vérifier dans le code

Assurez-vous que dans `payload.config.ts` la configuration de base de données est bien :

```ts
db: mongooseAdapter({
  url: process.env.MONGODB_URI!,
}),
```

✅ et aucune trace de PostgreSQL.

---

## Conclusion

Vous disposez d’un CMS mutualisé prêt pour plusieurs fronts (Vercel, IONOS, etc.), avec isolation stricte par client et une configuration adaptée à Railway + MongoDB.
