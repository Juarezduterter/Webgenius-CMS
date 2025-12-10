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
  },
  access: {
    read: () => true,
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
    },
    {
      name: 'content',
      type: 'richText',
    },
  ],
};
