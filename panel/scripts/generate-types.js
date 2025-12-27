import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This script generates TypeScript types from OpenAPI schema
// Run this script when backend DTOs change

const generateTypes = async () => {
  try {
    console.log("🔄 Generating types from OpenAPI schema...");

    // Get API URL from environment variable or use default
    const apiBaseUrl =
      process.env.VITE_API_BASE_URL ||
      process.env.API_BASE_URL ||
      "http://localhost:5000";
    const swaggerUrl = `${apiBaseUrl.replace(
      /\/$/,
      ""
    )}/swagger/v1/swagger.json`;

    console.log(`📡 Fetching schema from: ${swaggerUrl}`);

    // Fetch OpenAPI schema from backend
    const response = await fetch(swaggerUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch OpenAPI schema: ${response.status}`);
    }

    const schema = await response.json();

    // Generate TypeScript types based on schema
    const types = generateTypeScriptTypes(schema);

    // Write to schema.d.ts
    const outputPath = path.join(__dirname, "../src/api/schema.d.ts");
    fs.writeFileSync(outputPath, types);

    console.log("✅ Types generated successfully!");
    console.log(`📁 Output: ${outputPath}`);
  } catch (error) {
    console.error("❌ Error generating types:", error.message);
    console.log(
      "💡 Make sure the backend is running and VITE_API_BASE_URL is set in .env file"
    );
    process.exit(1);
  }
};

const generateTypeScriptTypes = (schema) => {
  const components = schema.components?.schemas || {};

  let types = `// Auto-generated types from OpenAPI schema
// Generated at: ${new Date().toISOString()}
// Source: ${schema.info?.title || "Hospital System API"} v${
    schema.info?.version || "1.0"
  }

`;

  // Generate types for each schema component
  Object.entries(components).forEach(([name, schema]) => {
    if (schema.type === "object") {
      types += generateInterface(name, schema);
    }
  });

  return types;
};

const generateInterface = (name, schema) => {
  let interfaceCode = `export interface ${name} {\n`;

  if (schema.properties) {
    Object.entries(schema.properties).forEach(([propName, propSchema]) => {
      const isOptional = !schema.required?.includes(propName);
      const type = getTypeScriptType(propSchema);
      interfaceCode += `  ${propName}${isOptional ? "?" : ""}: ${type};\n`;
    });
  }

  interfaceCode += "}\n\n";
  return interfaceCode;
};

const getTypeScriptType = (schema) => {
  if (schema.type === "string") {
    return "string";
  } else if (schema.type === "integer" || schema.type === "number") {
    return "number";
  } else if (schema.type === "boolean") {
    return "boolean";
  } else if (schema.type === "array") {
    const itemType = getTypeScriptType(schema.items);
    return `${itemType}[]`;
  } else if (schema.type === "object") {
    return "object";
  } else if (schema.$ref) {
    const refName = schema.$ref.split("/").pop();
    return refName;
  }

  return "any";
};

// Run the generator
generateTypes();
