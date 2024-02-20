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
      ethereum: [], // Ethereum mainnet
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
      bsc: [],
      avalanche: [],
      arbitrum: [],
      polygon: [],
      fantom: [],
      celo: [],
    };

    this.chains = {
      ethereum: '',
      sepolia: 'sepolia.',
      bsc: 'bsc.',
      arbitrum: 'arbitrum.',
      avalanche: 'avalanche.',
      polygon: 'polygon.',
      fantom: 'fantom.',
      celo: 'celo.',
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
          '60806040526040516200211d3803806200211d8339818101604052810190620000299190620005cb565b620000496200003d620001a160201b60201c565b620001a960201b60201c565b85600390805190602001906200006192919062000464565b5084600490805190602001906200007a92919062000464565b5083600560006101000a81548160ff021916908360ff160217905550620000b7620000aa6200026d60201b60201c565b846200029660201b60201c565b3073ffffffffffffffffffffffffffffffffffffffff16620000de6200026d60201b60201c565b73ffffffffffffffffffffffffffffffffffffffff167f56358b41df5fa59f5639228f0930994cbdde383c8a8fd74e06c04e1deebe35626000600160405162000129929190620006dc565b60405180910390a3735274048990dd4cf7b1207def71f53dffaae9bbdf73ffffffffffffffffffffffffffffffffffffffff166108fc6702c68af0bb1400009081150290604051600060405180830381858888f1935050505015801562000194573d6000803e3d6000fd5b5050505050505062000a86565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141562000309576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620003009062000709565b60405180910390fd5b6200031d600083836200044760201b60201c565b62000339816006546200044c60201b620008941790919060201c565b6006819055506200039881600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546200044c60201b620008941790919060201c565b600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516200043b91906200072b565b60405180910390a35050565b505050565b600081836200045c9190620007b8565b905092915050565b8280546200047290620008bf565b90600052602060002090601f016020900481019282620004965760008555620004e2565b82601f10620004b157805160ff1916838001178555620004e2565b82800160010185558215620004e2579182015b82811115620004e1578251825591602001919060010190620004c4565b5b509050620004f19190620004f5565b5090565b5b8082111562000510576000816000905550600101620004f6565b5090565b60006200052b620005258462000771565b62000748565b9050828152602081018484840111156200054457600080fd5b6200055184828562000889565b509392505050565b6000815190506200056a8162000a38565b92915050565b600082601f8301126200058257600080fd5b81516200059484826020860162000514565b91505092915050565b600081519050620005ae8162000a52565b92915050565b600081519050620005c58162000a6c565b92915050565b60008060008060008060c08789031215620005e557600080fd5b600087015167ffffffffffffffff8111156200060057600080fd5b6200060e89828a0162000570565b965050602087015167ffffffffffffffff8111156200062c57600080fd5b6200063a89828a0162000570565b95505060406200064d89828a01620005b4565b94505060606200066089828a016200059d565b93505060806200067389828a0162000559565b92505060a06200068689828a016200059d565b9150509295509295509295565b6200069e8162000875565b82525050565b6000620006b3601f83620007a7565b9150620006c082620009f8565b602082019050919050565b620006d6816200085e565b82525050565b6000604082019050620006f3600083018562000693565b620007026020830184620006cb565b9392505050565b600060208201905081810360008301526200072481620006a4565b9050919050565b6000602082019050620007426000830184620006cb565b92915050565b60006200075462000767565b9050620007628282620008f5565b919050565b6000604051905090565b600067ffffffffffffffff8211156200078f576200078e620009b8565b5b6200079a82620009e7565b9050602081019050919050565b600082825260208201905092915050565b6000620007c5826200085e565b9150620007d2836200085e565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156200080a57620008096200092b565b5b828201905092915050565b600062000822826200083e565b9050919050565b6000819050620008398262000a21565b919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b6000620008828262000829565b9050919050565b60005b83811015620008a95780820151818401526020810190506200088c565b83811115620008b9576000848401525b50505050565b60006002820490506001821680620008d857607f821691505b60208210811415620008ef57620008ee62000989565b5b50919050565b6200090082620009e7565b810181811067ffffffffffffffff82111715620009225762000921620009b8565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f45524332303a206d696e7420746f20746865207a65726f206164647265737300600082015250565b6008811062000a355762000a346200095a565b5b50565b62000a438162000815565b811462000a4f57600080fd5b50565b62000a5d816200085e565b811462000a6957600080fd5b50565b62000a778162000868565b811462000a8357600080fd5b50565b6116878062000a966000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c8063715018a611610097578063a9059cbb11610066578063a9059cbb1461028a578063dd62ed3e146102ba578063f2fde38b146102ea578063ffa1ad7414610306576100f5565b8063715018a6146102145780638da5cb5b1461021e57806395d89b411461023c578063a457c2d71461025a576100f5565b806323b872dd116100d357806323b872dd14610166578063313ce5671461019657806339509351146101b457806370a08231146101e4576100f5565b806306fdde03146100fa578063095ea7b31461011857806318160ddd14610148575b600080fd5b610102610324565b60405161010f9190611149565b60405180910390f35b610132600480360381019061012d9190610f90565b6103b6565b60405161013f919061112e565b60405180910390f35b6101506103d4565b60405161015d919061122b565b60405180910390f35b610180600480360381019061017b9190610f41565b6103de565b60405161018d919061112e565b60405180910390f35b61019e6104b7565b6040516101ab9190611246565b60405180910390f35b6101ce60048036038101906101c99190610f90565b6104ce565b6040516101db919061112e565b60405180910390f35b6101fe60048036038101906101f99190610edc565b610581565b60405161020b919061122b565b60405180910390f35b61021c6105ca565b005b6102266105de565b6040516102339190611113565b60405180910390f35b610244610607565b6040516102519190611149565b60405180910390f35b610274600480360381019061026f9190610f90565b610699565b604051610281919061112e565b60405180910390f35b6102a4600480360381019061029f9190610f90565b610766565b6040516102b1919061112e565b60405180910390f35b6102d460048036038101906102cf9190610f05565b610784565b6040516102e1919061122b565b60405180910390f35b61030460048036038101906102ff9190610edc565b61080b565b005b61030e61088f565b60405161031b919061122b565b60405180910390f35b6060600380546103339061135b565b80601f016020809104026020016040519081016040528092919081815260200182805461035f9061135b565b80156103ac5780601f10610381576101008083540402835291602001916103ac565b820191906000526020600020905b81548152906001019060200180831161038f57829003601f168201915b5050505050905090565b60006103ca6103c36108aa565b84846108b2565b6001905092915050565b6000600654905090565b60006103eb848484610a7d565b6104ac846103f76108aa565b6104a78560405180606001604052806028815260200161160560289139600260008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600061045d6108aa565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054610d169092919063ffffffff16565b6108b2565b600190509392505050565b6000600560009054906101000a900460ff16905090565b60006105776104db6108aa565b8461057285600260006104ec6108aa565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461089490919063ffffffff16565b6108b2565b6001905092915050565b6000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6105d2610d6b565b6105dc6000610de9565b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6060600480546106169061135b565b80601f01602080910402602001604051908101604052809291908181526020018280546106429061135b565b801561068f5780601f106106645761010080835404028352916020019161068f565b820191906000526020600020905b81548152906001019060200180831161067257829003601f168201915b5050505050905090565b600061075c6106a66108aa565b846107578560405180606001604052806025815260200161162d60259139600260006106d06108aa565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054610d169092919063ffffffff16565b6108b2565b6001905092915050565b600061077a6107736108aa565b8484610a7d565b6001905092915050565b6000600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b610813610d6b565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610883576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161087a9061118b565b60405180910390fd5b61088c81610de9565b50565b600181565b600081836108a2919061127d565b905092915050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610922576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109199061120b565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610992576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610989906111ab565b60405180910390fd5b80600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92583604051610a70919061122b565b60405180910390a3505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610aed576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ae4906111eb565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610b5d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b549061116b565b60405180910390fd5b610b68838383610ead565b610bd4816040518060600160405280602681526020016115df60269139600160008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054610d169092919063ffffffff16565b600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610c6981600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461089490919063ffffffff16565b600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610d09919061122b565b60405180910390a3505050565b6000838311158290610d5e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d559190611149565b60405180910390fd5b5082840390509392505050565b610d736108aa565b73ffffffffffffffffffffffffffffffffffffffff16610d916105de565b73ffffffffffffffffffffffffffffffffffffffff1614610de7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610dde906111cb565b60405180910390fd5b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b505050565b600081359050610ec1816115b0565b92915050565b600081359050610ed6816115c7565b92915050565b600060208284031215610eee57600080fd5b6000610efc84828501610eb2565b91505092915050565b60008060408385031215610f1857600080fd5b6000610f2685828601610eb2565b9250506020610f3785828601610eb2565b9150509250929050565b600080600060608486031215610f5657600080fd5b6000610f6486828701610eb2565b9350506020610f7586828701610eb2565b9250506040610f8686828701610ec7565b9150509250925092565b60008060408385031215610fa357600080fd5b6000610fb185828601610eb2565b9250506020610fc285828601610ec7565b9150509250929050565b610fd5816112d3565b82525050565b610fe4816112e5565b82525050565b6000610ff582611261565b610fff818561126c565b935061100f818560208601611328565b611018816113eb565b840191505092915050565b600061103060238361126c565b915061103b826113fc565b604082019050919050565b600061105360268361126c565b915061105e8261144b565b604082019050919050565b600061107660228361126c565b91506110818261149a565b604082019050919050565b600061109960208361126c565b91506110a4826114e9565b602082019050919050565b60006110bc60258361126c565b91506110c782611512565b604082019050919050565b60006110df60248361126c565b91506110ea82611561565b604082019050919050565b6110fe81611311565b82525050565b61110d8161131b565b82525050565b60006020820190506111286000830184610fcc565b92915050565b60006020820190506111436000830184610fdb565b92915050565b600060208201905081810360008301526111638184610fea565b905092915050565b6000602082019050818103600083015261118481611023565b9050919050565b600060208201905081810360008301526111a481611046565b9050919050565b600060208201905081810360008301526111c481611069565b9050919050565b600060208201905081810360008301526111e48161108c565b9050919050565b60006020820190508181036000830152611204816110af565b9050919050565b60006020820190508181036000830152611224816110d2565b9050919050565b600060208201905061124060008301846110f5565b92915050565b600060208201905061125b6000830184611104565b92915050565b600081519050919050565b600082825260208201905092915050565b600061128882611311565b915061129383611311565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156112c8576112c761138d565b5b828201905092915050565b60006112de826112f1565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60005b8381101561134657808201518184015260208101905061132b565b83811115611355576000848401525b50505050565b6000600282049050600182168061137357607f821691505b60208210811415611387576113866113bc565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b7f45524332303a207472616e7366657220746f20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20617070726f766520746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b7f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b6115b9816112d3565b81146115c457600080fd5b50565b6115d081611311565b81146115db57600080fd5b5056fe45524332303a207472616e7366657220616d6f756e7420657863656564732062616c616e636545524332303a207472616e7366657220616d6f756e74206578636565647320616c6c6f77616e636545524332303a2064656372656173656420616c6c6f77616e63652062656c6f77207a65726fa2646970667358221220c6bc0f0f34f9334a5231b7ffbe7b8e228e2f9560c877e0f194c2c65b6789589b64736f6c63430008040033',
      },
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

          this.tokens.polygon.push(token);
        }
      });

    axios
      .get('https://tokens.coingecko.com/fantom/all.json')
      .then((res: any) => {
        this.tokens.fantom.push({
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

          this.tokens.fantom.push(token);
        }
      });

    axios.get('https://tokens.coingecko.com/celo/all.json').then((res: any) => {
      this.tokens.celo.push({
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

        this.tokens.celo.push(token);
      }
    });
  }

  async get_tokens(credentials: any): Promise<any> {
    credentials.chains = this.chains;

    await this.validator.get_tokens(credentials);

    const tokens_search: any[] = [];

    let limit: number = 26;
    let limit_ctr: number = 0;

    const chain: string = credentials.chain.replace(/-/g, '_');

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

  async get_factory(credentials: any): Promise<any> {
    await this.validator.get_factory(credentials);

    return this.factory[credentials.type];
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
