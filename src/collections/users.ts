import { CollectionConfig } from 'payload';

export type UserRole = 'admin' | 'client';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      defaultValue: 'client',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Client', value: 'client' },
      ],
    },
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
      // Requis uniquement pour les clients, pas pour les admins
      required: false,
      hasMany: false,
      admin: {
        condition: (data) => data?.role === 'client',
        description: 'Site associé (requis pour les utilisateurs de type Client)',
      },
    },
  ],
  // Hook pour valider que les clients ont bien un site
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.role === 'client' && !data?.site) {
          throw new Error('Le champ "site" est obligatoire pour les utilisateurs de type Client');
        }
        return data;
      },
    ],
  },
};
