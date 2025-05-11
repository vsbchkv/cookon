import { JSONSchemaType } from 'ajv';
import { Schemas } from '../../shared-data/types';
import { AIdependencies } from '../../dependencies/dependencies';
import { GenerateContentResult, FileDataPart } from '@google/generative-ai';

type AIUtils = {
  usePrompt: (
    prompt: string
  ) => <T>(params?: { schema?: JSONSchemaType<T>; source?: string | URL; model?: string }) => Promise<string>;
  extractJsonFromString: (str: string) => object | null;
};

const createAIUtils = ({ GoogleGenerativeAI }: AIdependencies): AIUtils => {
  const AI_MODELS: { [key: string]: string } = {
    default: 'gemini-2.0-flash-lite',
    // extra: ['gemini-2.0-flash', 'gemini-2.5-flash-preview-04-17'],

    // slowBeta: 'gemini-2.5-pro-preview-03-25', // 5 : 25
    slowBeta: 'gemini-2.5-pro-exp-03-25',
    slowStable: 'gemini-1.5-pro', // 2 : 50,
    fastBeta: 'gemini-2.5-flash-preview-04-17', // 30 : 1500
    fastStable: 'gemini-2.0-flash-lite', // 30 : 1500
    fast: 'gemini-2.0-flash'
  };

  const { GEMINI_API_KEY = '' } = process.env;
  console.log('::', GEMINI_API_KEY);

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const defaultModel = genAI.getGenerativeModel({ model: AI_MODELS.fast });
  // const thinkingModel = genAI.getGenerativeModel({ model: AI_MODELS.slowBeta });
  const thinkingModel = genAI.getGenerativeModel({ model: AI_MODELS.fastBeta });

  const usePrompt =
    (prompt: string) =>
    async <T>(params?: { schema?: JSONSchemaType<T>; source?: string | URL; model?: string }) => {
      const model = params?.source ? thinkingModel : defaultModel;
      const useAiModel = async (request: string | [string, FileDataPart]) =>
        await model.generateContent(request).then((result: GenerateContentResult) => result.response.text());

      const textRequest = params?.schema
        ? `Generate a precise JavaScript object that strictly adheres to the following JSON schema for: "${prompt}"
    Schema Requirements:
    ${JSON.stringify(params.schema, null, 0)}

    Additional Guidelines:
    ${params.source ? `- Reference source material: ${params.source}` : ''}
    ${
      params.schema?.definitions?.Ingredient
        ? `- Ensure all values strictly conform to the schema types and formats
    - For nutritional data (macronutrients, micronutrients, calories):
      * Use USDA database as the primary source
      * Include units of measurement
      * Round numerical values to 2 decimal places`
        : ''
    }
    ${
      params.schema?.definitions?.Recipe?.properties?.method
        ? `- For preparation methods:
      * Break down steps clearly and numerically
      * Include specific temperatures and timing if avaliable
      * Note any critical techniques or tips`
        : ''
    }
    ${
      params.source && params.schema?.definitions?.Recipe?.properties?.author
        ? `* Provide author name, if avaliable in source`
        : ''
    }
    Return ONLY valid JSON without any additional text or explanations.`
        : prompt;

      const options: FileDataPart | null = (() => {
        if (params?.source && String(params?.source).includes('youtube')) {
          // Ensure params.source is converted to string for fileUri
          const sourceString = String(params.source);
          return {
            fileData: {
              mimeType: 'video/mp4',
              fileUri: sourceString
            }
          };
        }
        return null;
      })();

      const response = await useAiModel(options ? [textRequest, options] : textRequest);
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
