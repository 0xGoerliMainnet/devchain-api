'use strict';

// CONFIG
import config from '../config';

const schema = {
  name: 'extera_forms',
  bsonType: config.types.object,
  required: ['name', 'email', 'phone'],
  unique_props: ['email'],
  properties: {
    name: {
      bsonType: config.types.string,
    },

    email: {
      bsonType: config.types.string,
    },

    phone: {
      bsonType: config.types.string,
    },

    bio: {
      bsonType: config.types.string,
    },

    created_at: {
      bsonType: config.types.date,
    },

    updated_at: {
      bsonType: config.types.date,
    },
  },
};

export default schema;
