'use strict';

// MODULES
import axios from 'axios';
import { createClient } from 'redis';

// UTILS
import UTILS_COMMON from '../utils/common';

async function load_redis(options: any) {
  const client = createClient();

  client.on('error', (err: any) => {
    throw err;
  });

  await client.connect();

  /*
  await client.flushAll();
  await client.flushDb();
  */

  // SETTINGS
  let settings = await client.get('settings');

  if (!settings) {
    settings = JSON.stringify({
      banners: [{ img: '', src: '' }],
      campaigns: [{ img: '', src: '', message: '' }],
      notifications: [{ img: '', src: '', message: '' }],
    });

    await client.set('settings', settings);
  }

  await client.set('devchain_test', '1');

  options.redis = client;

  return client;
}

export default load_redis;
