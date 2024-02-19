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
  private api_keys_0x: string[];
  private api_keys_0x_index: number;
  private tokens: any;
  private chains: any;

  constructor(options: any) {
    this.options = options;

    this.validator = new UTILS_SERVICES.validator_blockchain_init(options);

    this.api_keys_0x = config.env.API_KEY_0X.split(' ');
    this.api_keys_0x_index = 0;

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
          img: '/images/token.png',
          decimals: 18,
          address: '0xfff9976782d46cc05630d1f6ebab18b2324d6b14',
          chain_id: 11155111,
        },
        {
          name: 'ChainLink Token',
          symbol: 'LINK',
          img: '/images/token.png',
          decimals: 18,
          address: '0x779877A7b0d9e8603169ddbd7836e478b4624789',
          chain_id: 11155111,
        },
        {
          name: 'Uniswap',
          symbol: 'UNI',
          img: '/images/token.png',
          decimals: 18,
          address: '0x1f9840a85d5aF5bf1d1762d925bdaddc4201f984',
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
        this.tokens.ethereum.push({
          chain_id: 1,
          img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          name: 'Ethereum',
          symbol: 'ETH',
          decimals: 18,
        });

        for (let i: number = 0; i < res.data.tokens.length; i++) {
          const token = {
            chain_id: res.data.tokens[i].chainId,
            img: res.data.tokens[i].logoURI,
            address: res.data.tokens[i].address,
            name: res.data.tokens[i].name,
            symbol: res.data.tokens[i].symbol,
            decimals: res.data.tokens[i].decimals,
          };

          this.tokens.ethereum.push(token);
        }
      });

    axios
      .get('https://tokens.coingecko.com/binance-smart-chain/all.json')
      .then((res: any) => {
        this.tokens.bsc.push({
          chain_id: 56,
          img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18,
        });

        for (let i: number = 0; i < res.data.tokens.length; i++) {
          const token = {
            chain_id: res.data.tokens[i].chainId,
            img: res.data.tokens[i].logoURI,
            address: res.data.tokens[i].address,
            name: res.data.tokens[i].name,
            symbol: res.data.tokens[i].symbol,
            decimals: res.data.tokens[i].decimals,
          };

          this.tokens.bsc.push(token);
        }
      });

    axios
      .get('https://tokens.coingecko.com/avalanche/all.json')
      .then((res: any) => {
        this.tokens.avalanche.push({
          chain_id: 43114,
          img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          name: 'Avalanche',
          symbol: 'AVAX',
          decimals: 18,
        });

        for (let i: number = 0; i < res.data.tokens.length; i++) {
          const token = {
            chain_id: res.data.tokens[i].chainId,
            img: res.data.tokens[i].logoURI,
            address: res.data.tokens[i].address,
            name: res.data.tokens[i].name,
            symbol: res.data.tokens[i].symbol,
            decimals: res.data.tokens[i].decimals,
          };

          this.tokens.avalanche.push(token);
        }
      });

    axios
      .get('https://tokens.coingecko.com/arbitrum-one/all.json')
      .then((res: any) => {
        this.tokens.arbitrum.push({
          chain_id: 42161,
          img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png',
          address: '0x912Ce59144191c1204e64559fe8253a0e49e6548',
          name: 'Arbitrum',
          symbol: 'ARB',
          decimals: 18,
        });

        for (let i: number = 0; i < res.data.tokens.length; i++) {
          const token = {
            chain_id: res.data.tokens[i].chainId,
            img: res.data.tokens[i].logoURI,
            address: res.data.tokens[i].address,
            name: res.data.tokens[i].name,
            symbol: res.data.tokens[i].symbol,
            decimals: res.data.tokens[i].decimals,
          };

          this.tokens.arbitrum.push(token);
        }
      });

    axios
      .get('https://tokens.coingecko.com/polygon-pos/all.json')
      .then((res: any) => {
        this.tokens.polygon.push({
          chain_id: 137,
          img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          name: 'Polygon',
          symbol: 'MATIC',
          decimals: 18,
        });

        for (let i: number = 0; i < res.data.tokens.length; i++) {
          const token = {
            chain_id: res.data.tokens[i].chainId,
            img: res.data.tokens[i].logoURI,
            address: res.data.tokens[i].address,
            name: res.data.tokens[i].name,
            symbol: res.data.tokens[i].symbol,
            decimals: res.data.tokens[i].decimals,
          };

          this.tokens.polygon.push(token);
        }
      });
  }

  async get_tokens(credentials: any): Promise<any> {
    await this.validator.get_tokens(credentials);

    const tokens_search: any[] = [];

    let limit: number = 26;
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

    const api_key_0x: string = this.api_keys_0x[this.api_keys_0x_index];
    const res: any = await axios.get(url, {
      headers: { '0x-api-key': api_key_0x },
    });

    this.api_keys_0x_index++;

    if (this.api_keys_0x_index >= this.api_keys_0x.length) {
      this.api_keys_0x_index = 0;
    }

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

    const api_key_0x: string = this.api_keys_0x[this.api_keys_0x_index];
    const res: any = await axios.get(url, {
      headers: { '0x-api-key': api_key_0x },
    });

    this.api_keys_0x_index++;
    if (this.api_keys_0x_index >= this.api_keys_0x.length) {
      this.api_keys_0x_index = 0;
    }

    return res.data;
  }
}

export default service_blockchain_init;
