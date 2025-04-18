import { JSONSchemaType } from 'ajv';
import { Schemas } from '../../shared-data/types';
import { AIdependencies } from '../../dependencies/dependencies';
import { GenerateContentResult } from '@google/generative-ai';

type AIUtils = {
  usePrompt: (prompt: string) => <T>(params?: { schema?: JSONSchemaType<T>; source?: string | URL }) => Promise<string>;
  extractJsonFromString: (str: string) => object | null;
};

const createAIUtils = ({ GoogleGenerativeAI }: AIdependencies): AIUtils => {
  const AI_MODELS: { [key: string]: string } = {
    slowBeta: 'gemini-2.0-pro-exp-02-05', // 2 : 50
    slowStable: 'gemini-1.5-pro', // 2 : 50,
    fastBeta: 'gemini-2.0-flash-lite-preview-02-05', // 30 : 1500
    fastStable: 'gemini-1.5-flash-8b' // 15 : 1500
  };

  const { GEMINI_API_KEY = '' } = process.env;
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const defaultModel = genAI.getGenerativeModel({ model: AI_MODELS.fastBeta });

  const usePrompt =
    (prompt: string) =>
    async <T>(params?: { schema?: JSONSchemaType<T>; source?: string | URL }) => {
      const model = params?.source ? genAI.getGenerativeModel({ model: AI_MODELS.slowStable }) : defaultModel;
      console.log('AI: ', model, params?.source);

      const useAiModel = async (request: string) =>
        await model.generateContent(request).then((result: GenerateContentResult) => result.response.text());

      const request = params?.schema
        ? `Generate a precise JavaScript object that strictly adheres to the following JSON schema for: "${prompt}"

    Schema Requirements:
    ${JSON.stringify(params.schema, null, 0)}

    Additional Guidelines:
    - Ensure all values strictly conform to the schema types and formats
    - For nutritional data (macronutrients, micronutrients, calories):
      * Use USDA database as the primary source
      * Include units of measurement
      * Round numerical values to 2 decimal places
    ${params.source ? `- Reference source material: ${params.source}` : ''}
    ${
      params.schema?.definitions?.properties?.method
        ? `- For preparation methods:
      * Break down steps clearly and numerically
      * Include specific temperatures and timing if avaliable and applicable
      * Note any critical techniques or tips`
        : ''
    }

    Return ONLY valid JSON without any additional text or explanations.`
        : prompt;
      const response = await useAiModel(request);
      console.log('AI gen ', prompt);

      return response;
    };

  const extractJsonFromString = (str: string) => {
    try {
      const startIndex = str.indexOf('{');
      const endIndex = str.lastIndexOf('}') + 1;

      if (startIndex === -1 || endIndex === 0) {
        return null;
      }
      const jsonStr = str.substring(startIndex, endIndex);

      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return null;
    }
  };

  return { usePrompt, extractJsonFromString };
};

export type { AIUtils };

export { createAIUtils };
