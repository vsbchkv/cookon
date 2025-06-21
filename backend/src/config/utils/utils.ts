import { AIUtils, createAIUtils } from './ai-utils';
import { FSUtils, createFSutils } from './fs-utils';
import { PathUtils, createPathUtils } from './path-util';
import { ValidationUtils, createValidationUtils } from './validators';
import { UtilsDependencies } from '../dependencies/dependencies';

type CurriedFn<Args extends unknown[], R> = Args extends [infer First, ...infer Rest]
  ? ((...args: Args) => R) & ((first: First) => CurriedFn<Rest, R>)
  : R;

type Curry = <T extends unknown[], R>(fn: (...args: T) => R) => CurriedFn<T, R>;
type CapitalizeString = (string: string) => string;

type NodeUtils = FSUtils & PathUtils;
type Utils = {
  capitalizeString: CapitalizeString;
  curry: Curry;
} & NodeUtils &
  AIUtils &
  ValidationUtils & {
    jsonSchemas: Record<string, object>;
  };

const createUtils = (utilsDependencies: UtilsDependencies) => {
  const curry: Curry = <T extends unknown[], R>(fn: (...args: T) => R): CurriedFn<T, R> => {
    const curried = (...args: unknown[]) =>
      args.length >= fn.length ? fn(...(args as T)) : (...args2: unknown[]) => curried(...args, ...args2);

    return curried as unknown as CurriedFn<T, R>;
  };

  const capitalizeString = (string: string): string => string.slice(0, 1).toUpperCase() + string.slice(1) || '';

  const nodeUtils: NodeUtils = {
    ...createFSutils(curry, utilsDependencies),
    ...createPathUtils(utilsDependencies)
  };
  const aiUtils = createAIUtils(utilsDependencies);
  const { jsonSchemas } = utilsDependencies;
  const validationUtils = createValidationUtils(utilsDependencies);
  const utils = { ...nodeUtils, ...aiUtils, jsonSchemas, ...validationUtils, capitalizeString, curry };
  return utils;
};

export type { Utils, NodeUtils, Curry, CurriedFn };
export { createUtils };
