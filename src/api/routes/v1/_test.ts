'use strict';

// INTERFACES
import { Document } from 'mongodb';
import { FastifyInstance } from 'fastify';
import { routes_i, services_i } from 'interfaces/api';

// API > MIDDLEWARE
import mw from '../../middleware';
import mw_auth from '../../middleware/auth';

// API > SCHEMAS
import schemas from '../../schemas';

// CONFIG
import config from '../../../config';

function bind_test_routes(
  server: FastifyInstance,
  services: services_i,
  options: any
): FastifyInstance {
  // @ Route Options Area
  const routes: routes_i = {
    // #title: GET PROFILE
    // #state: Public
    // #desc: Check if request has session and user, response: IProfile | null
    test: {
      method: 'GET',
      url: '/v1/form',
      //preValidation: mw.prevalidation(null, options),
      schema: {
        querystring: {
          name: { type: config.types.string },
          phone: { type: config.types.string },
          email: { type: config.types.string },
          bio: { type: config.types.string },
        },
      },
      handler: async function (request: any, reply: any) {
        const credentials: any = {
          ...request.query,
        };

        try {
          const data = await options.redis.hGetAll('forms');
          const length = Object.keys(data).length;

          let id: number = length + 1;

          for (let i: number = 0; i < length; i++) {}

          await options.redis.hSet(
            'forms',
            id.toString(),
            JSON.stringify({ ...request.query })
          );

          console.log(data);

          //await options.redis.hSet('test', '1');

          const result = {};

          reply.send(result);
        } catch (err: any) {
          reply.status(422).send(err);
        }
      },
    },

    get_test: {
      method: 'GET',
      url: '/v1/forms',
      preValidation: mw.prevalidation(null, options),
      handler: async function (request: any, reply: any) {
        const credentials = {};

        try {
          const data: any = await options.redis.hGetAll('forms');

          let arr: any = [];

          for (const key in data) {
            arr.push(JSON.parse(data[key]));
          }

          reply.send(arr);
        } catch (err: any) {
          reply.status(422).send(err);
        }
      },
    },
  };

  // Route them in fastify
  for (const key in routes) {
    server.route(routes[key]);
  }

  return server;
}

export default bind_test_routes;
