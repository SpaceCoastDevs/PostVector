import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Application } from 'express';

// Polyfill __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (typeof globalThis.__dirname === 'undefined') {
  globalThis.__dirname = __dirname;
}
if (typeof globalThis.__filename === 'undefined') {
  globalThis.__filename = __filename;
}

export async function setupSwagger(app: Application): Promise<void> {
  try {
    // Dynamic import to avoid SSR issues
    const swaggerUi = await import('swagger-ui-express');
    const swaggerJsdoc = await import('swagger-jsdoc');

    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'PostVector API',
          version: '1.0.0',
          description: 'API documentation for PostVector application',
        },
        servers: [
          {
            url: '/api',
            description: 'Development server',
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
      apis: ['./src/api/**/*.ts'], // paths to files containing OpenAPI definitions
    };

    const specs = swaggerJsdoc.default(options);
    
    // Custom CSS to fix potential styling issues
    const customCss = `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
    `;

    // Swagger UI options with proper configuration for development
    const swaggerUiOptions = {
      customCss,
      customSiteTitle: 'PostVector API Documentation',
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showRequestHeaders: true,
      },
    };

    // Serve swagger docs JSON
    app.get('/api-docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(specs);
    });

    // Setup Swagger UI with proper static file handling
    app.use('/api-docs', swaggerUi.default.serve);
    app.get('/api-docs', swaggerUi.default.setup(specs, swaggerUiOptions));

    console.log('✅ Swagger documentation setup complete');
    console.log('📖 API docs available at: /api-docs');
    console.log('📄 API spec available at: /api-docs.json');
  } catch (error) {
    console.error('❌ Failed to setup Swagger documentation:', error);
  }
}
