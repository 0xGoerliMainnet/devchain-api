'use strict';

// MODULES
import fs from 'fs';
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

  constructor(options: any) {
    this.options = options;

    this.validator = new UTILS_SERVICES.validator_blockchain_init(options);
  }

  async get_token_security(credentials: any): Promise<any | null> {}
}

export default service_blockchain_init;
