import tsj from "ts-json-schema-generator";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Default types to process
const DEFAULT_TYPES = ["Ingredient", "Recipe"];

// Pure function to create directory paths
const createDirectoryPaths = (basePaths) => 
  basePaths.flatMap(basePath => [
    `${basePath}/types`,
    `${basePath}/schemas`
  ]);

// Pure function to create schema file paths
const createSchemaPath = (type) => 
  `./schemas/${type.toLowerCase()}.json`;

// Pure function to create generator config
const createGeneratorConfig = (typePath, type) => ({
  path: typePath,
  type,
  tsconfig: "./tsconfig.json"
});

// Higher-order function to create schema generator
const createSchemaGenerator = (config) => 
  tsj.createGenerator(config);

// Pure function to generate schema
const generateSchema = (generator, type) => 
  generator.createSchema(type);

// Async function to ensure directory exists
const ensureDirectory = async (dirPath) => {
  await fs.mkdir(dirPath, { recursive: true });
  return dirPath;
};

// Async function to write schema file
const writeSchemaFile = async (filePath, schema) => {
  await fs.writeFile(filePath, JSON.stringify(schema, null, 2));
  return filePath;
};

// Async function to copy directory
const copyDirectory = async (source, destination) => {
  await execAsync(`cp -r ${source} ${destination}`);
  return { source, destination };
};

// Main schema generation pipeline
const generateSchemaForType = (typePath) => async (type) => {
  const config = createGeneratorConfig(typePath, type);
  const generator = createSchemaGenerator(config);
  const schema = generateSchema(generator, type);
  const schemaPath = createSchemaPath(type);
  
  await writeSchemaFile(schemaPath, schema);
  return { type, schemaPath };
};

// Main execution pipeline
const executeWorkflow = async (types, config = {}) => {
  const {
    typePath = "./types/**/*.ts",
    basePaths = [
      "../frontend/src/shared-data",
      "../backend/src/config/shared-data"
    ]
  } = config;

  // Create all necessary directories
  const directoryPaths = createDirectoryPaths(basePaths);
  const createdDirs = await Promise.all(
    directoryPaths.map(ensureDirectory)
  );

  // Generate schemas for all types
  const schemaGenerator = generateSchemaForType(typePath);
  const generatedSchemas = await Promise.all(
    types.map(schemaGenerator)
  );

  // Copy files to all destinations
  const copyOperations = basePaths.flatMap(basePath => [
    copyDirectory("./types", basePath),
    copyDirectory("./schemas", basePath)
  ]);
  
  const copyResults = await Promise.all(copyOperations);

  return {
    createdDirectories: createdDirs,
    generatedSchemas,
    copyOperations: copyResults
  };
};

// Main function with default types
const main = async (types = DEFAULT_TYPES) => {
  try {
    console.log(`Processing types: ${types.join(", ")}`);
    
    const results = await executeWorkflow(types);
    
    console.log(`✅ Created ${results.createdDirectories.length} directories`);
    console.log(`✅ Generated ${results.generatedSchemas.length} schemas`);
    console.log(`✅ Completed ${results.copyOperations.length} copy operations`);
    console.log("All operations completed successfully!");
    
    return results;
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

// Execute with default types or custom types from command line
const typesFromArgs = process.argv.slice(2);
const typesToProcess = typesFromArgs.length > 0 ? typesFromArgs : undefined;

main(typesToProcess);

export { executeWorkflow, generateSchemaForType, main };