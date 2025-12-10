import { CollectionConfig } from 'payload';

export const Sites: CollectionConfig = {
  slug: 'sites',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Identifiant unique du site (URL-friendly, ex: mon-site-web)',
      },
      validate: (val: unknown) => {
        if (typeof val !== 'string') {
          return true; // Le champ 'required' gère déjà les valeurs manquantes
        }
        // Validation pour slug URL-friendly : lettres, chiffres, tirets et underscores uniquement
        if (!/^[a-z0-9-_]+$/.test(val)) {
          return 'Le slug doit contenir uniquement des lettres minuscules, chiffres, tirets (-) et underscores (_)';
        }
        return true;
      },
    },
  ],
};
