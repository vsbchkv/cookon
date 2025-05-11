import { JSONSchemaType } from 'ajv';
import type { UtilsDependencies } from '../../dependencies/dependencies';

type ValidationUtils = {
  validate: <T>(schema: JSONSchemaType<T>) => (data: object) => boolean;
};

const createValidationUtils = ({ Ajv }: UtilsDependencies): ValidationUtils => {
  const ajv = new Ajv();

  const validate = <T>(schema: JSONSchemaType<T>) => {
    const validate = ajv.compile(schema);
    return (data: object) => {
      try {
        const res = validate(data);
        if (typeof res === 'boolean') {
          return res;
        } else {
          return false;
        }
      } catch (error) {
        console.error('VALIDATION ERROR ', error); // TODO: Implement error handling
        return false;
      }
    };
  };
  return {
    validate
  };
};

export type { ValidationUtils };
export { createValidationUtils };
