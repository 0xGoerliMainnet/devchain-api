'use strict';

// MODULES
import fs from 'fs';
import crypto from 'node:crypto';

// INTERFACES
import { Document, InsertOneResult, ObjectId } from 'mongodb';

// CONFIG
import config from '../config';

// UTILS
import UTILS_SERVICES from '../utils/services';
import UTILS_COMMON from '../utils/common';

class service_extera_init {
  private options: any;
  private validator: any;

  constructor(options: any) {
    this.options = options;
    this.validator = new UTILS_SERVICES.validator_extera_init(options);
  }

  async create_form(credentials: any): Promise<any> {
    await this.validator.create_form(credentials, this.options);

    const doc: any = await UTILS_SERVICES.create_extera_form_doc(
      credentials,
      this.options
    );

    const result = await this.options.db.extera_forms.insertOne(doc);

    return {
      ...doc,
      _id: result.insertedId,
    };
  }

  async get_forms(credentials: any): Promise<any> {
    await this.validator.get_forms(credentials, this.options);

    const limit: number = 20;
    const page: number = Number(credentials.page);

    const forms = await this.options.db.extera_forms
      .find({ email: { $regex: credentials.uid } })
      .limit(20)
      .skip(page === 1 ? 0 : page * limit)
      .toArray();

    return forms;
  }
}

export default service_extera_init;
