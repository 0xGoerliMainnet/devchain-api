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

function bind_extera_routes(
  server: FastifyInstance,
  services: services_i,
  options: any
): FastifyInstance {
  // @ Route Options Area
  const routes: routes_i = {
    // #title: GET PROFILE
    // #state: Public
    // #desc: Check if request has session and user, response: IProfile | null

    // #title: EDIT PROFILE
    // #state: Private
    // #desc: Allow signed in user to edit its profile credentials.
    forms: {
      method: 'POST',
      url: '/v1' + config.endpoints.extera_forms,
      schema: {},
      preValidation: mw.prevalidation(null, options),
      handler: async function (request: any, reply: any) {
        const credentials: any = { ...request.body, ip: request.ip };

        try {
          const result = await services.extera.create_form(credentials);

          reply.send(result);
        } catch (err: any) {
          reply.status(422).send(err);
        }
      },
    },

    forms_get: {
      method: 'GET',
      url: '/v1' + config.endpoints.extera_forms,
      schema: {
        querystring: {
          uid: { type: config.types.string },
        },
      },
      preValidation: mw.prevalidation(null, options),
      handler: async function (request: any, reply: any) {
        const credentials: any = {
          uid: request.query.uid,
        };

        try {
          const result = await services.extera.get_forms(credentials);

          reply.send(result);
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

export default bind_extera_routes;
