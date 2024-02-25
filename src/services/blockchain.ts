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
  private readonly api_keys_0x: string[];
  private api_keys_0x_index: number;
  private tokens: any;
  private readonly chains: any;
  private readonly factory: any;

  constructor(options: any) {
    this.options = options;

    this.validator = new UTILS_SERVICES.validator_blockchain_init(options);

    this.api_keys_0x = config.env.API_KEY_0X.split(' ');
    this.api_keys_0x_index = 0;

    this.tokens = {
      '1': [], // Ethereum Mainnet
      '56': [], // Binance Smart Chain
      '137': [], // Polygon
      '250': [], // Fantom
      '42161': [], // Arbitrum
      '42220': [], // Celo
      '43114': [], // Avalanche
      '11155111': [
        {
          name: 'SepoliaETH',
          symbol: 'ETH',
          img: '/images/token.png',
          decimals: 18,
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          chain_id: 11155111,
        },
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
      ], // Sepolia
    };

    this.chains = {
      // Ethereum Mainnet
      '1': {
        name: 'Ethereum Mainnet',
        token_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        token_name: 'Ethereum',
        token_symbol: 'ETH',
        token_decimals: 18,
        token_img: '/images/ethereum.png',
        usdt_address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        usdt_decimals: 6,
        url_explorer: 'https://etherscan.io',
        '0x_param': '',
      },

      // BSC
      '56': {
        name: 'Binance Smart Chain',
        token_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        token_name: 'BNB',
        token_symbol: 'BNB',
        token_decimals: 18,
        token_img: '/images/bnb.png',
        usdt_address: '0x55d398326f99059ff775485246999027b3197955',
        usdt_decimals: 18,
        url_explorer: 'https://bscscan.com',
        '0x_param': 'bsc.',
      },

      // Polygon
      '137': {
        name: 'Polygon Mainnet',
        token_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        token_name: 'Polygon',
        token_symbol: 'MATIC',
        token_decimals: 18,
        token_img: '/images/polygon.png',
        usdt_address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        usdt_decimals: 6,
        url_explorer: 'https://polygonscan.com',
        '0x_param': 'polygon.',
      },

      // Fantom
      '250': {
        name: 'Fantom Mainnet',
        token_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        token_name: 'Fantom',
        token_symbol: 'FTM',
        token_decimals: 18,
        usdt_address: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
        usdt_decimals: 6,
        url_explorer: 'https://ftmscan.com',
        '0x_param': 'fantom.',
      },

      // Arbitrum
      '42161': {
        name: 'Arbitrum Mainnet',
        token_img: '/images/arbitrum.png',
        token_address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
        token_name: 'Arbitrum',
        token_symbol: 'ARB',
        token_decimals: 6,
        usdt_address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        usdt_decimals: 6,
        url_explorer: 'https://arbiscan.io',
        '0x_param': 'arbitrum.',
      },

      // Celo
      '42220': {
        name: 'Celo Mainnet',
        token_img: '/images/celo.png',
        token_address: '0x471ece3750da237f93b8e339c536989b8978a438',
        token_name: 'Celo',
        token_symbol: 'CELO',
        token_decimals: 18,
        usdt_address: '',
        usdt_decimals: 0,
        usdc_address: '0x37f750b7cc259a2f741af45294f6a16572cf5cad',
        usdc_decimals: 6,
        url_explorer: 'https://celoscan.io/',
        '0x_param': 'celo.',
      },

      // Avalanche
      '43114': {
        name: 'Avalanche Mainnet C-Chain',
        token_img: '/images/avalanche.png',
        token_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        token_name: 'Avalanche',
        token_symbol: 'AVAX',
        token_decimals: 18,
        usdt_address: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
        usdt_decimals: 6,
        url_explorer: 'https://snowtrace.io/',
        '0x_param': 'avalanche.',
      },

      // Sepolia
      '11155111': {
        name: 'Sepolia Testnet',
        token_img: '/images/token.png',
        token_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        token_name: 'Sepolia',
        token_symbol: 'SepoliaETH',
        token_decimals: 18,
        usdt_address: '0x7169d38820dfd117c3fa1f22a697dba58d90ba06',
        usdt_decimals: 6,
        url_explorer: 'https://sepolia.etherscan.io',
        '0x_param': 'sepolia.',
      },
    };

    this.factory = {
      standard: {
        abi: [
          {
            inputs: [
              {
                internalType: 'string',
                name: 'name_',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'symbol_',
                type: 'string',
              },
              {
                internalType: 'uint8',
                name: 'decimals_',
                type: 'uint8',
              },
              {
                internalType: 'uint256',
                name: 'totalSupply_',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'serviceFeeReceiver_',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'serviceFee_',
                type: 'uint256',
              },
            ],
            stateMutability: 'payable',
            type: 'constructor',
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
              },
              {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address',
              },
              {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
              },
            ],
            name: 'Approval',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
              },
              {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
              },
            ],
            name: 'OwnershipTransferred',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
              },
              {
                indexed: true,
                internalType: 'address',
                name: 'token',
                type: 'address',
              },
              {
                indexed: false,
                internalType: 'enum TokenType',
                name: 'tokenType',
                type: 'uint8',
              },
              {
                indexed: false,
                internalType: 'uint256',
                name: 'version',
                type: 'uint256',
              },
            ],
            name: 'TokenCreated',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
              },
              {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
              },
              {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
              },
            ],
            name: 'Transfer',
            type: 'event',
          },
          {
            inputs: [],
            name: 'VERSION',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'owner',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'spender',
                type: 'address',
              },
            ],
            name: 'allowance',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'spender',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
            ],
            name: 'approve',
            outputs: [
              {
                internalType: 'bool',
                name: '',
                type: 'bool',
              },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'account',
                type: 'address',
              },
            ],
            name: 'balanceOf',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'decimals',
            outputs: [
              {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'spender',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'subtractedValue',
                type: 'uint256',
              },
            ],
            name: 'decreaseAllowance',
            outputs: [
              {
                internalType: 'bool',
                name: '',
                type: 'bool',
              },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'spender',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'addedValue',
                type: 'uint256',
              },
            ],
            name: 'increaseAllowance',
            outputs: [
              {
                internalType: 'bool',
                name: '',
                type: 'bool',
              },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [],
            name: 'name',
            outputs: [
              {
                internalType: 'string',
                name: '',
                type: 'string',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'owner',
            outputs: [
              {
                internalType: 'address',
                name: '',
                type: 'address',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'renounceOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [],
            name: 'symbol',
            outputs: [
              {
                internalType: 'string',
                name: '',
                type: 'string',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'totalSupply',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'recipient',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
            ],
            name: 'transfer',
            outputs: [
              {
                internalType: 'bool',
                name: '',
                type: 'bool',
              },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'sender',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'recipient',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
            ],
            name: 'transferFrom',
            outputs: [
              {
                internalType: 'bool',
                name: '',
                type: 'bool',
              },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
              },
            ],
            name: 'transferOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        bytecode:
          '608060405260405162002113380380620021138339818101604052810190620000299190620005b8565b620000496200003d6200018560201b60201c565b6200018d60201b60201c565b85600390805190602001906200006192919062000451565b5084600490805190602001906200007a92919062000451565b5083600560006101000a81548160ff021916908360ff160217905550620000b7620000aa6200025160201b60201c565b846200027a60201b60201c565b3073ffffffffffffffffffffffffffffffffffffffff16620000de6200025160201b60201c565b73ffffffffffffffffffffffffffffffffffffffff167f56358b41df5fa59f5639228f0930994cbdde383c8a8fd74e06c04e1deebe35626000600160405162000129929190620006c9565b60405180910390a38173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015801562000178573d6000803e3d6000fd5b5050505050505062000a73565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415620002ed576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620002e490620006f6565b60405180910390fd5b62000301600083836200042c60201b60201c565b506200031e816006546200043960201b620008941790919060201c565b6006819055506200037d81600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546200043960201b620008941790919060201c565b600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405162000420919062000718565b60405180910390a35050565b6000600190509392505050565b60008183620004499190620007a5565b905092915050565b8280546200045f90620008ac565b90600052602060002090601f016020900481019282620004835760008555620004cf565b82601f106200049e57805160ff1916838001178555620004cf565b82800160010185558215620004cf579182015b82811115620004ce578251825591602001919060010190620004b1565b5b509050620004de9190620004e2565b5090565b5b80821115620004fd576000816000905550600101620004e3565b5090565b60006200051862000512846200075e565b62000735565b9050828152602081018484840111156200053157600080fd5b6200053e84828562000876565b509392505050565b600081519050620005578162000a25565b92915050565b600082601f8301126200056f57600080fd5b81516200058184826020860162000501565b91505092915050565b6000815190506200059b8162000a3f565b92915050565b600081519050620005b28162000a59565b92915050565b60008060008060008060c08789031215620005d257600080fd5b600087015167ffffffffffffffff811115620005ed57600080fd5b620005fb89828a016200055d565b965050602087015167ffffffffffffffff8111156200061957600080fd5b6200062789828a016200055d565b95505060406200063a89828a01620005a1565b94505060606200064d89828a016200058a565b93505060806200066089828a0162000546565b92505060a06200067389828a016200058a565b9150509295509295509295565b6200068b8162000862565b82525050565b6000620006a0601f8362000794565b9150620006ad82620009e5565b602082019050919050565b620006c3816200084b565b82525050565b6000604082019050620006e0600083018562000680565b620006ef6020830184620006b8565b9392505050565b60006020820190508181036000830152620007118162000691565b9050919050565b60006020820190506200072f6000830184620006b8565b92915050565b60006200074162000754565b90506200074f8282620008e2565b919050565b6000604051905090565b600067ffffffffffffffff8211156200077c576200077b620009a5565b5b6200078782620009d4565b9050602081019050919050565b600082825260208201905092915050565b6000620007b2826200084b565b9150620007bf836200084b565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115620007f757620007f662000918565b5b828201905092915050565b60006200080f826200082b565b9050919050565b6000819050620008268262000a0e565b919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60006200086f8262000816565b9050919050565b60005b838110156200089657808201518184015260208101905062000879565b83811115620008a6576000848401525b50505050565b60006002820490506001821680620008c557607f821691505b60208210811415620008dc57620008db62000976565b5b50919050565b620008ed82620009d4565b810181811067ffffffffffffffff821117156200090f576200090e620009a5565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f45524332303a206d696e7420746f20746865207a65726f206164647265737300600082015250565b6008811062000a225762000a2162000947565b5b50565b62000a308162000802565b811462000a3c57600080fd5b50565b62000a4a816200084b565b811462000a5657600080fd5b50565b62000a648162000855565b811462000a7057600080fd5b50565b6116908062000a836000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c8063715018a611610097578063a9059cbb11610066578063a9059cbb1461028a578063dd62ed3e146102ba578063f2fde38b146102ea578063ffa1ad7414610306576100f5565b8063715018a6146102145780638da5cb5b1461021e57806395d89b411461023c578063a457c2d71461025a576100f5565b806323b872dd116100d357806323b872dd14610166578063313ce5671461019657806339509351146101b457806370a08231146101e4576100f5565b806306fdde03146100fa578063095ea7b31461011857806318160ddd14610148575b600080fd5b610102610324565b60405161010f9190611152565b60405180910390f35b610132600480360381019061012d9190610f99565b6103b6565b60405161013f9190611137565b60405180910390f35b6101506103d4565b60405161015d9190611234565b60405180910390f35b610180600480360381019061017b9190610f4a565b6103de565b60405161018d9190611137565b60405180910390f35b61019e6104b7565b6040516101ab919061124f565b60405180910390f35b6101ce60048036038101906101c99190610f99565b6104ce565b6040516101db9190611137565b60405180910390f35b6101fe60048036038101906101f99190610ee5565b610581565b60405161020b9190611234565b60405180910390f35b61021c6105ca565b005b6102266105de565b604051610233919061111c565b60405180910390f35b610244610607565b6040516102519190611152565b60405180910390f35b610274600480360381019061026f9190610f99565b610699565b6040516102819190611137565b60405180910390f35b6102a4600480360381019061029f9190610f99565b610766565b6040516102b19190611137565b60405180910390f35b6102d460048036038101906102cf9190610f0e565b610784565b6040516102e19190611234565b60405180910390f35b61030460048036038101906102ff9190610ee5565b61080b565b005b61030e61088f565b60405161031b9190611234565b60405180910390f35b60606003805461033390611364565b80601f016020809104026020016040519081016040528092919081815260200182805461035f90611364565b80156103ac5780601f10610381576101008083540402835291602001916103ac565b820191906000526020600020905b81548152906001019060200180831161038f57829003601f168201915b5050505050905090565b60006103ca6103c36108aa565b84846108b2565b6001905092915050565b6000600654905090565b60006103eb848484610a7d565b6104ac846103f76108aa565b6104a78560405180606001604052806028815260200161160e60289139600260008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600061045d6108aa565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054610d179092919063ffffffff16565b6108b2565b600190509392505050565b6000600560009054906101000a900460ff16905090565b60006105776104db6108aa565b8461057285600260006104ec6108aa565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461089490919063ffffffff16565b6108b2565b6001905092915050565b6000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6105d2610d6c565b6105dc6000610dea565b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60606004805461061690611364565b80601f016020809104026020016040519081016040528092919081815260200182805461064290611364565b801561068f5780601f106106645761010080835404028352916020019161068f565b820191906000526020600020905b81548152906001019060200180831161067257829003601f168201915b5050505050905090565b600061075c6106a66108aa565b846107578560405180606001604052806025815260200161163660259139600260006106d06108aa565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054610d179092919063ffffffff16565b6108b2565b6001905092915050565b600061077a6107736108aa565b8484610a7d565b6001905092915050565b6000600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b610813610d6c565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610883576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161087a90611194565b60405180910390fd5b61088c81610dea565b50565b600181565b600081836108a29190611286565b905092915050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610922576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161091990611214565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610992576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610989906111b4565b60405180910390fd5b80600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92583604051610a709190611234565b60405180910390a3505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610aed576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ae4906111f4565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610b5d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b5490611174565b60405180910390fd5b610b68838383610eae565b50610bd5816040518060600160405280602681526020016115e860269139600160008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054610d179092919063ffffffff16565b600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610c6a81600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461089490919063ffffffff16565b600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610d0a9190611234565b60405180910390a3505050565b6000838311158290610d5f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d569190611152565b60405180910390fd5b5082840390509392505050565b610d746108aa565b73ffffffffffffffffffffffffffffffffffffffff16610d926105de565b73ffffffffffffffffffffffffffffffffffffffff1614610de8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ddf906111d4565b60405180910390fd5b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b6000600190509392505050565b600081359050610eca816115b9565b92915050565b600081359050610edf816115d0565b92915050565b600060208284031215610ef757600080fd5b6000610f0584828501610ebb565b91505092915050565b60008060408385031215610f2157600080fd5b6000610f2f85828601610ebb565b9250506020610f4085828601610ebb565b9150509250929050565b600080600060608486031215610f5f57600080fd5b6000610f6d86828701610ebb565b9350506020610f7e86828701610ebb565b9250506040610f8f86828701610ed0565b9150509250925092565b60008060408385031215610fac57600080fd5b6000610fba85828601610ebb565b9250506020610fcb85828601610ed0565b9150509250929050565b610fde816112dc565b82525050565b610fed816112ee565b82525050565b6000610ffe8261126a565b6110088185611275565b9350611018818560208601611331565b611021816113f4565b840191505092915050565b6000611039602383611275565b915061104482611405565b604082019050919050565b600061105c602683611275565b915061106782611454565b604082019050919050565b600061107f602283611275565b915061108a826114a3565b604082019050919050565b60006110a2602083611275565b91506110ad826114f2565b602082019050919050565b60006110c5602583611275565b91506110d08261151b565b604082019050919050565b60006110e8602483611275565b91506110f38261156a565b604082019050919050565b6111078161131a565b82525050565b61111681611324565b82525050565b60006020820190506111316000830184610fd5565b92915050565b600060208201905061114c6000830184610fe4565b92915050565b6000602082019050818103600083015261116c8184610ff3565b905092915050565b6000602082019050818103600083015261118d8161102c565b9050919050565b600060208201905081810360008301526111ad8161104f565b9050919050565b600060208201905081810360008301526111cd81611072565b9050919050565b600060208201905081810360008301526111ed81611095565b9050919050565b6000602082019050818103600083015261120d816110b8565b9050919050565b6000602082019050818103600083015261122d816110db565b9050919050565b600060208201905061124960008301846110fe565b92915050565b6000602082019050611264600083018461110d565b92915050565b600081519050919050565b600082825260208201905092915050565b60006112918261131a565b915061129c8361131a565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156112d1576112d0611396565b5b828201905092915050565b60006112e7826112fa565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60005b8381101561134f578082015181840152602081019050611334565b8381111561135e576000848401525b50505050565b6000600282049050600182168061137c57607f821691505b602082108114156113905761138f6113c5565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b7f45524332303a207472616e7366657220746f20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20617070726f766520746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b7f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b6115c2816112dc565b81146115cd57600080fd5b50565b6115d98161131a565b81146115e457600080fd5b5056fe45524332303a207472616e7366657220616d6f756e7420657863656564732062616c616e636545524332303a207472616e7366657220616d6f756e74206578636565647320616c6c6f77616e636545524332303a2064656372656173656420616c6c6f77616e63652062656c6f77207a65726fa26469706673582212209689326e78706b507e6bd91b793b9bb7fa7abf6d8e8cc00e6aae5c54a11805f964736f6c63430008040033',
      },
    };

    // Get tokens from supported chains
    // #service: CoinGecko.com
    axios
      .get('https://tokens.coingecko.com/ethereum/all.json')
      .then((res: any) => {
        this.tokens['1'].push({
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

          this.tokens['1'].push(token);
        }
      });

    axios
      .get('https://tokens.coingecko.com/binance-smart-chain/all.json')
      .then((res: any) => {
        this.tokens['56'].push({
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

          this.tokens['56'].push(token);
        }
      });

    axios
      .get('https://tokens.coingecko.com/polygon-pos/all.json')
      .then((res: any) => {
        this.tokens['137'].push({
          chain_id: 137,
          img: '/images/polygon.png',
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

          this.tokens['137'].push(token);
        }
      });

    axios
      .get('https://tokens.coingecko.com/fantom/all.json')
      .then((res: any) => {
        this.tokens['250'].push({
          chain_id: 250,
          img: '/images/fantom.png',
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          name: 'Fantom',
          symbol: 'FTM',
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

          this.tokens['250'].push(token);
        }
      });

    axios
      .get('https://tokens.coingecko.com/arbitrum-one/all.json')
      .then((res: any) => {
        this.tokens['42161'].push({
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

          this.tokens['42161'].push(token);
        }
      });

    axios.get('https://tokens.coingecko.com/celo/all.json').then((res: any) => {
      this.tokens['42220'].push({
        chain_id: 42220,
        img: '/images/celo.png',
        address: '0x471ece3750da237f93b8e339c536989b8978a438',
        name: 'Celo',
        symbol: 'CELO',
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

        this.tokens['42220'].push(token);
      }
    });

    axios
      .get('https://tokens.coingecko.com/avalanche/all.json')
      .then((res: any) => {
        this.tokens['43114'].push({
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

          this.tokens['43114'].push(token);
        }
      });
  }

  async get_tokens(credentials: any): Promise<any> {
    await this.validator.get_tokens(credentials, this.chains);

    const tokens_search: any[] = [];

    const chain_id: string = credentials.chain_id || '1'; // Ethereum Mainnet as default;
    let limit: number = 26;
    let limit_ctr: number = 0;

    for (let i: number = 0; i < this.tokens[chain_id].length; i++) {
      if (limit_ctr >= limit) {
        break;
      }

      if (!credentials.search) {
        tokens_search.push(this.tokens[chain_id][i]);
        limit_ctr++;

        continue;
      }

      if (
        this.tokens[chain_id][i].address
          .toLowerCase()
          .includes(credentials.search.toLowerCase()) ||
        this.tokens[chain_id][i].name
          .toLowerCase()
          .includes(credentials.search.toLowerCase()) ||
        this.tokens[chain_id][i].symbol
          .toLowerCase()
          .includes(credentials.search.toLowerCase())
      ) {
        tokens_search.push(this.tokens[chain_id][i]);

        limit_ctr++;
      }
    }

    return tokens_search;
  }

  async factory_get(credentials: any): Promise<any> {
    await this.validator.factory_get(credentials, this.factory);
    return this.factory[credentials.type];
  }

  async factory_create(credentials: any): Promise<any> {
    await this.validator.factory_create(credentials, this.chains, this.factory);

    /**
     * Supported crypto scans that have valid api for verifying contracts
     */
    const chains: any = {
      '1': {
        api_key: config.env.API_KEY_ETHERSCAN,
        url: 'https://api.etherscan.io/api',
      },
      '56': {
        api_key: config.env.API_KEY_BSCSCAN,
        url: 'https://api.bscscan.io/api',
      },
      '97': {
        api_key: config.env.API_KEY_BSCSCAN,
        url: 'https://api-testnet.bscscan.com/api',
      },
      '137': {
        api_key: config.env.API_KEY_POLYGONSCAN,
        url: 'https://api.polygonscan.com/api',
      },
      '250': {
        api_key: config.env.API_KEY_FTMSCAN,
        url: 'https://api.ftmscan.com/api',
      },
      '42161': {
        api_key: config.env.API_KEY_ARBISCAN,
        url: 'https://api.arbiscan.io/api',
      },
      '11155111': {
        api_key: config.env.API_KEY_ETHERSCAN,
        url: 'https://api-sepolia.etherscan.io/api',
      },
    };

    if (!chains[credentials.chain_id]) {
      return;
    }

    /* compiler versions
     *
     *
     * https://bscscan.com/verifyContract
     *
     *
     * v0.8.24+commit.e11b9ed9
     * v0.8.23+commit.f704f362
     * v0.8.22+commit.4fc1097e
     *
     * v0.8.9+commit.e5eed63a
     * v0.8.8+commit.dddeac2f
     * v0.8.7+commit.e28d00a7
     * v0.8.6+commit.11564f7e
     * v0.8.5+commit.a4f2e591
     * v0.8.4+commit.c7e474f2
     *
     *
     */

    const factory: any = {
      standard: {
        path: process.cwd() + '/contracts/StandardToken.sol',
        contract_name: 'StandardToken',
        version: 'v0.8.4+commit.c7e474f2',
      },
      liquidity_generator:
        process.cwd() + '/contracts/LiquidityGeneratorToken.sol',
      contract_name: 'LiqudityGeneratorToken',
      version: 'v0.8.4+commit.c7e474f2',
    };

    const source_code: string = fs.readFileSync(
      factory[credentials.type].path,
      'utf8'
    );

    const form: string = `contractaddress=${
      credentials.contract_address
    }&apikey=${
      chains[credentials.chain_id].api_key
    }&codeformat=solidity-single-file&contractname=${
      factory[credentials.type].contract_name
    }&optimizationused=0&compilerversion=${
      factory[credentials.type].version
    }&sourceCode=${source_code}&module=contract&action=verifysourcecode`;

    const res = await axios.post(chains[credentials.chain_id].url, form, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return res.data;
  }

  async swap_quote(credentials: any): Promise<any | null> {
    await this.validator.swap_quote(credentials, this.chains);

    // TODO:

    const query: string = '?' + credentials.url.split('?')[1];

    const url: string =
      'https://' +
      this.chains[credentials.chain_id]['0x_param'] +
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
    await this.validator.swap_price(credentials, this.chains);

    const query: string = '?' + credentials.url.split('?')[1];

    const url: string =
      'https://' +
      this.chains[credentials.chain_id]['0x_param'] +
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
