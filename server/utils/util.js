import { validationResult } from 'express-validator'

export const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
      return {
        msg: error.msg,
        param:error.param,
      };
    }
  });