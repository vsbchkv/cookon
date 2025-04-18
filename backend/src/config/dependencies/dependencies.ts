import * as dotenv from 'dotenv';
import { IncomingMessage, Server, ServerResponse } from 'http';
import cors, { FastifyCorsOptions } from '@fastify/cors';
import fastify, { FastifyInstance } from 'fastify';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import fs from 'fs/promises';
import ingredientSchema from '../shared-data/schemas/ingredient.json';
import path from 'path';
import recipeSchema from '../shared-data/schemas/recipe.json';

dotenv.config();

type AppDependencies = {
  readonly createServer: () => FastifyInstance<Server, IncomingMessage, ServerResponse>;
  readonly corsOptions: FastifyCorsOptions;
  readonly logger: {
    info: (message: string) => void;
    error: (message: string) => void;
  };
};

type AIdependencies = {
  readonly GoogleGenerativeAI: typeof GoogleGenerativeAI;
};

type UtilsDependencies = {
  readonly fs: typeof fs;
  readonly path: typeof path;
  readonly fileURLToPath: typeof fileURLToPath;
  readonly Ajv: typeof Ajv;
  readonly jsonSchemas: typeof jsonSchemas;
} & AIdependencies;

const jsonSchemas = { recipeSchema, ingredientSchema };
const utilsDependencies = { fs, path, fileURLToPath, jsonSchemas, GoogleGenerativeAI, Ajv };
const aiDependencies = { GoogleGenerativeAI };

const createAppDependencies = (): AppDependencies => {
  const defaultCorsOptions: FastifyCorsOptions = {
    origin: (origin, cb) => {
      const allowedDomains = ['http://localhost:3000', 'http://localhost:8080'];
      const allowedPattern: RegExp = /(:8080|:3000)$/;
      const allowedIPs: string[] = [];

      if (!origin) {
        cb(null, true);
        return;
      }

      const hostname = new URL(origin).hostname;
      if (allowedPattern.test(origin) || allowedDomains.includes(origin) || allowedIPs.includes(hostname)) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS' + origin), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
  };
  return {
    createServer: () => {
      const server = fastify({
        logger: {
          level: 'info',
          file: './logs/server.log'
        }
      });
      server.register(cors, defaultCorsOptions);
      // server.setErrorHandler((_error, _request, _reply) => { // TODO: err handler
      //   // reply.status(500).send({ ok: false });
      //   // reply.status(404).send('Not found'); // TODO: Err handler
      // });
      return server;
    },
    logger: console,
    corsOptions: defaultCorsOptions
  };
};

export type { AppDependencies, UtilsDependencies, AIdependencies };
export { createAppDependencies, utilsDependencies, aiDependencies };
