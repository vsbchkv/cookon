```
mkdir -p ../frontend/src/shared-data/types ../frontend/src/shared-data/schemas ../backend/src/config/shared-data/types ../backend/config/src/shared-data/schemas

npx ts-json-schema-generator --path "./types/**/*.ts" --type "Ingredient" --out "./schemas/ingredient.json"
npx ts-json-schema-generator --path "./types/**/*.ts" --type "Recipe" --out "./schemas/recipe.json"

cp -r ./types ../frontend/src/shared-data/
cp -r ./types ../backend/src/config/shared-data/
cp -r ./schemas ../frontend/src/shared-data/
cp -r ./schemas ../backend/src/config/shared-data/
```
