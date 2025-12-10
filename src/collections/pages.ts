import { Access, CollectionConfig } from 'payload';
import { UserRole } from './users';

const tenantAccess: Access = ({ req }) => {
  const user = req.user as { role?: UserRole; site?: string } | null;

  if (!user) {
    return false;
  }

  if (user.role === 'admin') {
    return true;
  }

  if (user.role === 'client' && user.site) {
    return {
      site: {
        equals: user.site,
      },
    };
  }

  return false;
};

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    // Filtre par défaut dans l'admin : les clients ne voient que les pages de leur site
    defaultColumns: ['title', 'slug', 'site', 'updatedAt'],
  },
  access: {
    // Lecture publique pour l'API, mais dans l'admin filtrée par site pour les clients
    read: ({ req }) => {
      const user = req.user as { role?: UserRole; site?: string } | null;

      // Pas de user = accès public API
      if (!user) {
        return true;
      }

      // Admin voit tout
      if (user.role === 'admin') {
        return true;
      }

      // Client voit uniquement son site
      if (user.role === 'client' && user.site) {
        return {
          site: {
            equals: user.site,
          },
        };
      }

      return false;
    },
    create: tenantAccess,
    update: tenantAccess,
    delete: tenantAccess,
  },
  fields: [
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
      required: true,
      // Filtre le dropdown : les clients ne voient que leur propre site
      filterOptions: ({ user }) => {
        const typedUser = user as { role?: UserRole; site?: string } | null;

        if (!typedUser || typedUser.role === 'admin') {
          return true; // Admin voit tous les sites
        }

        if (typedUser.role === 'client' && typedUser.site) {
          return {
            id: {
              equals: typedUser.site,
            },
          };
        }

        return false;
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Slug de la page (URL-friendly, ex: ma-page)',
      },
      validate: (val: unknown) => {
        if (typeof val !== 'string') {
          return true; // Le champ 'required' gère déjà les valeurs manquantes
        }
        // Validation pour slug URL-friendly : lettres, chiffres, tirets et underscores uniquement
        if (!/^[a-z0-9-_/]+$/.test(val)) {
          return 'Le slug doit contenir uniquement des lettres minuscules, chiffres, tirets (-), underscores (_) et slashes (/)';
        }
        return true;
      },
    },
    {
      name: 'content',
      type: 'richText',
    },
  ],
};
