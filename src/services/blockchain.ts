'use strict';

// MODULES
import fs from 'fs';
import axios from 'axios';
import crypto from 'node:crypto';
import validator from 'validator';

// INTERFACES
import { Document, InsertOneResult, ObjectId } from 'mongodb';

// CONFIG
import config from '../config';

// UTILS
import UTILS_SERVICES from '../utils/services';
import UTILS_COMMON from '../utils/common';

class service_blockchain_init {
  private options: any;
  private validator: any;
  private tokens: any;
  private chains: any;

  constructor(options: any) {
    this.options = options;

    this.validator = new UTILS_SERVICES.validator_blockchain_init(options);

    this.tokens = {
      ethereum: [], // Ethereum mainnet
      bsc: [],
      avalanche: [],
      arbitrum: [],
      polygon: [],
      sepolia: [
        {
          name: 'Wrapped Ether',
          symbol: 'WETH',
          img: 'https://api.devchain.net/public/images/token.png',
          decimals: 18,
          address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
          chain_id: 11155111,
        },
        {
          name: 'ChainLink Token',
          symbol: 'LINK',
          img: 'https://api.devchain.net/public/images/token.png',
          decimals: 18,
          address: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
          chain_id: 11155111,
        },
        {
          name: 'Uniswap',
          symbol: 'UNI',
          img: 'https://api.devchain.net/public/images/token.png',
          decimals: 18,
          address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
          chain_id: 11155111,
        },
      ],
    };

    this.chains = {
      ethereum: '',
      bsc: 'bsc.',
      arbitrum: 'arbitrum.',
      avalanche: 'avalanche.',
      polygon: 'polygon.',
      sepolia: 'sepolia.',
    };

    // Get tokens from supported chains
    // #service: CoinGecko.com
    axios
      .get('https://tokens.coingecko.com/ethereum/all.json')
      .then((res: any) => {
        for (let i: number = 0; i < res.data.tokens.length; i++) {
          this.tokens.ethereum[i] = {};

          this.tokens.ethereum[i].chain_id = res.data.tokens[i].chainId;
          this.tokens.ethereum[i].img = res.data.tokens[i].logoURI;
          this.tokens.ethereum[i].address = res.data.tokens[i].address;
          this.tokens.ethereum[i].name = res.data.tokens[i].name;
          this.tokens.ethereum[i].symbol = res.data.tokens[i].symbol;
          this.tokens.ethereum[i].decimals = res.data.tokens[i].decimals;
        }

        this.tokens.ethereum.push({
          chain_id: 1,
          img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          name: 'Ethereum',
          symbol: 'ETH',
          decimals: 18,
        });
      });

    axios
      .get('https://tokens.coingecko.com/binance-smart-chain/all.json')
      .then((res: any) => {
        for (let i: number = 0; i < res.data.tokens.length; i++) {
          this.tokens.bsc[i] = {};

          this.tokens.bsc[i].chain_id = res.data.tokens[i].chainId;
          this.tokens.bsc[i].img = res.data.tokens[i].logoURI;
          this.tokens.bsc[i].address = res.data.tokens[i].address;
          this.tokens.bsc[i].name = res.data.tokens[i].name;
          this.tokens.bsc[i].symbol = res.data.tokens[i].symbol;
          this.tokens.bsc[i].decimals = res.data.tokens[i].decimals;
        }

        this.tokens.bsc.push({
          chain_id: 56,
          img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18,
        });
      });

    axios
      .get('https://tokens.coingecko.com/avalanche/all.json')
      .then((res: any) => {
        for (let i: number = 0; i < res.data.tokens.length; i++) {
          this.tokens.avalanche[i] = {};

          this.tokens.avalanche[i].chain_id = res.data.tokens[i].chainId;
          this.tokens.avalanche[i].img = res.data.tokens[i].logoURI;
          this.tokens.avalanche[i].address = res.data.tokens[i].address;
          this.tokens.avalanche[i].name = res.data.tokens[i].name;
          this.tokens.avalanche[i].symbol = res.data.tokens[i].symbol;
          this.tokens.avalanche[i].decimals = res.data.tokens[i].decimals;
        }

        this.tokens.avalanche.push({
          chain_id: 43114,
          img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          name: 'Avalanche',
          symbol: 'AVAX',
          decimals: 18,
        });
      });

    axios
      .get('https://tokens.coingecko.com/arbitrum-one/all.json')
      .then((res: any) => {
        for (let i: number = 0; i < res.data.tokens.length; i++) {
          this.tokens.arbitrum[i] = {};

          this.tokens.arbitrum[i].chain_id = res.data.tokens[i].chainId;
          this.tokens.arbitrum[i].img = res.data.tokens[i].logoURI;
          this.tokens.arbitrum[i].address = res.data.tokens[i].address;
          this.tokens.arbitrum[i].name = res.data.tokens[i].name;
          this.tokens.arbitrum[i].symbol = res.data.tokens[i].symbol;
          this.tokens.arbitrum[i].decimals = res.data.tokens[i].decimals;
        }

        this.tokens.arbitrum.push({
          chain_id: 42161,
          img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png',
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          name: 'Arbitrum',
          symbol: 'ARB',
          decimals: 18,
        });
      });

    axios
      .get('https://tokens.coingecko.com/polygon-pos/all.json')
      .then((res: any) => {
        for (let i: number = 0; i < res.data.tokens.length; i++) {
          this.tokens.polygon[i] = {};

          this.tokens.polygon[i].chain_id = res.data.tokens[i].chainId;
          this.tokens.polygon[i].img = res.data.tokens[i].logoURI;
          this.tokens.polygon[i].address = res.data.tokens[i].address;
          this.tokens.polygon[i].name = res.data.tokens[i].name;
          this.tokens.polygon[i].symbol = res.data.tokens[i].symbol;
          this.tokens.polygon[i].decimals = res.data.tokens[i].decimals;
        }

        this.tokens.polygon.push({
          chain_id: 137,
          img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          name: 'Polygon',
          symbol: 'MATIC',
          decimals: 18,
        });
      });
  }

  async get_tokens(credentials: any): Promise<any> {
    await this.validator.get_tokens(credentials);

    const tokens_search: any[] = [];

    let limit: number = 20;
    let limit_ctr: number = 0;
    const chain: string = credentials.chain.replace(/-/g, '_');

    if (!this.tokens[chain]) {
      return tokens_search;
    }

    for (let i: number = 0; i < this.tokens[chain].length; i++) {
      if (limit_ctr >= limit) {
        break;
      }

      if (!credentials.search) {
        tokens_search.push(this.tokens[chain][i]);
        limit_ctr++;

        continue;
      }

      if (
        this.tokens[chain][i].address
          .toLowerCase()
          .includes(credentials.search.toLowerCase()) ||
        this.tokens[chain][i].name
          .toLowerCase()
          .includes(credentials.search.toLowerCase()) ||
        this.tokens[chain][i].symbol
          .toLowerCase()
          .includes(credentials.search.toLowerCase())
      ) {
        tokens_search.push(this.tokens[chain][i]);

        limit_ctr++;
      }
    }

    return tokens_search;
  }

  async swap_quote(credentials: any): Promise<any | null> {
    await this.validator.swap_quote(credentials);

    // TODO:

    let query: string = '?' + credentials.url.split('?')[1];

    const url: string =
      'https://' +
      this.chains[credentials.chain] +
      'api.0x.org/swap/v1/quote' +
      query;

    const res: any = await axios.get(url, {
      headers: { '0x-api-key': config.env.API_KEY_0X },
    });

    return res.data;
  }

  async swap_price(credentials: any): Promise<any | null> {
    await this.validator.swap_price(credentials);

    let query: string = '?' + credentials.url.split('?')[1];

    const url: string =
      'https://' +
      this.chains[credentials.chain] +
      'api.0x.org/swap/v1/price' +
      query;

    const res: any = await axios.get(url, {
      headers: { '0x-api-key': config.env.API_KEY_0X },
    });

    return res.data;
  }
}

export default service_blockchain_init;
