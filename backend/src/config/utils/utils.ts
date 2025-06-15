import { AIUtils, createAIUtils } from './ai-utils';
import { FSUtils, createFSutils } from './fs-utils';
import { PathUtils, createPathUtils } from './path-util';
import { ValidationUtils, createValidationUtils } from './validators';
import { UtilsDependencies } from '../dependencies/dependencies';

type NodeUtils = FSUtils & PathUtils;
type Utils = NodeUtils &
  AIUtils &
  ValidationUtils & {
    jsonSchemas: Record<string, object>;
  };

const createUtils = (utilsDependencies: UtilsDependencies) => {
  const capitalizeString = (string: string): string => string.slice(0, 1).toUpperCase() + string.slice(1) || '';
  const nodeUtils: NodeUtils = {
    ...createFSutils(utilsDependencies),
    ...createPathUtils(utilsDependencies)
  };
  const aiUtils = createAIUtils(utilsDependencies);
  const { jsonSchemas } = utilsDependencies;
  const validationUtils = createValidationUtils(utilsDependencies);
  const utils = { ...nodeUtils, ...aiUtils, jsonSchemas, ...validationUtils, capitalizeString };
  return utils;
};

export type { Utils, NodeUtils };
export { createUtils };
