'use strict';

// MODULES
import axios from 'axios';

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

function bind_blockchain_routes(
  server: FastifyInstance,
  services: services_i,
  options: any
): FastifyInstance {
  // @ Route Options Area
  const routes: routes_i = {
    // #title: GET PROFILE
    // #state: Public
    // #desc: Check if request has session and user, response: IProfile | null

    // #service: CoinGecko.com
    get_tokens: {
      method: 'GET',
      url: '/v1' + config.endpoints.blockchain_tokens,
      schema: {
        querystring: {
          search: { type: config.types.string },
        },
      },
      //preValidation: mw.prevalidation(null, options),
      handler: async function (request: any, reply: any) {
        const credentials: any = {
          chain: request.params.chain,
          search: request.query.search,
        };

        try {
          const tokens = await services.blockchain.get_tokens(credentials);

          reply.send(tokens);
        } catch (err: any) {
          reply.status(422).send(err);
        }
      },
    },

    // #service: GoPlusLabs.io
    get_token_security: {
      method: 'GET',
      url: '/v1' + config.endpoints.blockchain_token_security,
      schema: {
        querystring: {
          contract_addresses: { type: config.types.string },
        },
      },
      //preValidation: mw.prevalidation(null, options),
      handler: async function (request: any, reply: any) {
        const credentials: any = {
          chain_id: request.params.chain_id,
          contract_addresses: request.query.contract_addresses,
        };

        try {
          const res = await axios.get(
            'https://api.gopluslabs.io/api/v1/token_security/' +
              credentials.chain_id +
              '?contract_addresses=' +
              credentials.contract_addresses
          );

          reply.send(res.data);
        } catch (err: any) {
          if (err.response) {
            reply.status(422).send(err.response.data);
            return;
          }

          reply.status(422).send(err);
        }
      },
    },

    // #service: GoPlusLabs.io
    get_address_security: {
      method: 'GET',
      url: '/v1' + config.endpoints.blockchain_address_security,
      schema: {
        querystring: {
          chain_id: { type: config.types.string },
        },
      },
      //preValidation: mw.prevalidation(null, options),
      handler: async function (request: any, reply: any) {
        const credentials: any = {
          address: request.params.address,
          chain_id: request.query.chain_id,
        };

        try {
          const res = await axios.get(
            'https://api.gopluslabs.io/api/v1/address_security/' +
              credentials.address +
              '?chain_id=' +
              credentials.chain_id
          );

          reply.send(res.data);
        } catch (err: any) {
          if (err.response) {
            reply.status(422).send(err.response.data);
            return;
          }

          reply.status(422).send(err);
        }
      },
    },

    // #service: GoPlusLabs.io
    get_approval_security: {
      method: 'GET',
      url: '/v1' + config.endpoints.blockchain_approval_security,
      schema: {
        querystring: {
          contract_addresses: { type: config.types.string },
        },
      },
      //preValidation: mw.prevalidation(null, options),
      handler: async function (request: any, reply: any) {
        const credentials: any = {
          chain_id: request.params.chain_id,
          contract_addresses: request.query.contract_addresses,
        };

        try {
          const res = await axios.get(
            'https://api.gopluslabs.io/api/v1/approval_security/' +
              credentials.chain_id +
              '?contract_addresses=' +
              credentials.contract_addresses
          );

          reply.send(res.data);
        } catch (err: any) {
          if (err.response) {
            reply.status(422).send(err.response.data);
            return;
          }

          reply.status(422).send(err);
        }
      },
    },

    // #service: GoPlusLabs.io
    get_nft_security: {
      method: 'GET',
      url: '/v1' + config.endpoints.blockchain_nft_security,
      schema: {
        querystring: {
          contract_addresses: { type: config.types.string },
          token_id: { type: config.types.string },
        },
      },
      //preValidation: mw.prevalidation(null, options),
      handler: async function (request: any, reply: any) {
        const credentials: any = {
          chain_id: request.params.chain_id,
          contract_addresses: request.query.contract_addresses,
          token_id: request.query.token_id,
        };

        try {
          const res = await axios.get(
            'https://api.gopluslabs.io/api/v1/nft_security/' +
              credentials.chain_id +
              '?contract_addresses=' +
              credentials.contract_addresses +
              '&token_id=' +
              credentials.token_id
          );

          reply.send(res.data);
        } catch (err: any) {
          if (err.response) {
            reply.status(422).send(err.response.data);
            return;
          }

          reply.status(422).send(err);
        }
      },
    },

    // #service: GoPlusLabs.io
    get_dapp_security: {
      method: 'GET',
      url: '/v1' + config.endpoints.blockchain_dapp_security,
      schema: {
        querystring: {
          url: { type: config.types.string },
        },
      },
      //preValidation: mw.prevalidation(null, options),
      handler: async function (request: any, reply: any) {
        const credentials: any = {
          url: request.query.url,
        };

        try {
          const res = await axios.get(
            'https://api.gopluslabs.io/api/v1/dapp_security?url=' +
              credentials.url
          );

          reply.send(res.data);
        } catch (err: any) {
          if (err.response) {
            reply.status(422).send(err.response.data);
            return;
          }

          reply.status(422).send(err);
        }
      },
    },

    // #service: GoPlusLabs.io
    check_phishing_site: {
      method: 'GET',
      url: '/v1' + config.endpoints.blockchain_pishing_site,
      schema: {
        querystring: {
          url: { type: config.types.string },
        },
      },
      //preValidation: mw.prevalidation(null, options),
      handler: async function (request: any, reply: any) {
        const credentials: any = {
          url: request.query.url,
        };

        try {
          const res = await axios.get(
            'https://api.gopluslabs.io/api/v1/phishing_site?url=' +
              credentials.url
          );

          reply.send(res.data);
        } catch (err: any) {
          if (err.response) {
            reply.status(422).send(err.response.data);
            return;
          }

          reply.status(422).send(err);
        }
      },
    },

    // #service: GoPlusLabs.io
    check_rugpull_detecting: {
      method: 'GET',
      url: '/v1' + config.endpoints.blockchain_rugpull_detecting,
      schema: {
        querystring: {
          contract_addresses: { type: config.types.string },
        },
      },
      //preValidation: mw.prevalidation(null, options),
      handler: async function (request: any, reply: any) {
        const credentials: any = {
          chain_id: request.params.chain_id,
          contract_addresses: request.query.contract_addresses,
        };

        try {
          const res = await axios.get(
            'https://api.gopluslabs.io/api/v1/rugpull_detecting/' +
              credentials.chain_id +
              '?contract_addresses=' +
              credentials.contract_addresses
          );

          reply.send(res.data);
        } catch (err: any) {
          if (err.response) {
            reply.status(422).send(err.response.data);
            return;
          }

          reply.status(422).send(err);
        }
      },
    },

    // #service: GoPlusLabs.io
    input_decode: {
      method: 'POST',
      url: '/v1' + config.endpoints.blockchain_input_decode,
      handler: async function (request: any, reply: any) {
        const credentials: any = {
          chain_id: request.body.chain_id,
          contract_addresses: request.body.contract_addresses,
          data: request.body.data,
          input: request.body.input,
          signer: request.body.signer,
          transaction_type: request.body.transaction_type,
        };

        try {
          const res = await axios.post(
            'https://api.gopluslabs.io/api/v1/input_decode',
            credentials
          );

          reply.send(res.data);
        } catch (err: any) {
          if (err.response) {
            reply.status(422).send(err.response.data);
            return;
          }

          reply.status(422).send(err);
        }
      },
    },

    // #service: 0x.org
    swap_quote: {
      method: 'GET',
      url: '/v1' + config.endpoints.blockchain_swap_quote,
      schema: {
        querystring: {
          buyToken: { type: config.types.string },
          sellToken: { type: config.types.string },
          sellAmount: { type: config.types.string },
          value: { type: config.types.string },
          data: { type: config.types.string },
          chain: { type: config.types.string },
        },
      },
      handler: async function (request: any, reply: any) {
        const credentials: any = {
          ...request.query,
          url: request.url,
          chain: request.query.chain,
        };

        try {
          const result = await services.blockchain.swap_quote(credentials);

          reply.send(result);
        } catch (err: any) {
          if (err.response) {
            reply.status(422).send(err.response.data);
            return;
          }

          reply.status(422).send(err);
        }
      },
    },

    // #service: 0x.org
    swap_price: {
      method: 'GET',
      url: '/v1' + config.endpoints.blockchain_swap_price,
      schema: {
        querystring: {
          buyToken: { type: config.types.string },
          sellToken: { type: config.types.string },
          sellAmount: { type: config.types.string },
          value: { type: config.types.string },
          data: { type: config.types.string },
          chain: { type: config.types.string },
        },
      },
      handler: async function (request: any, reply: any) {
        const credentials: any = {
          ...request.query,
          url: request.url,
          chain: request.query.chain,
        };

        try {
          const result = await services.blockchain.swap_price(credentials);

          reply.send(result);
        } catch (err: any) {
          if (err.response) {
            reply.status(422).send(err.response.data);
            return;
          }

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

export default bind_blockchain_routes;
