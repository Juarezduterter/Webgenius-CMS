import path from 'path';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { Pages } from './collections/pages';
import { Sites } from './collections/sites';
import { Users } from './collections/users';

const FRONTEND_ORIGINS = process.env.FRONTEND_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean) ?? [];

export default buildConfig({
  serverURL: process.env.PUBLIC_URL,
  admin: {
    user: Users.slug,
  },
  cors: FRONTEND_ORIGINS,
  csrf: FRONTEND_ORIGINS,
  editor: lexicalEditor(),
  collections: [Sites, Users, Pages],
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  typescript: {
    outputFile: path.resolve(__dirname, '../payload-types.ts'),
  },
});
