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
      required: true,
      hasMany: false,
    },
  ],
};
