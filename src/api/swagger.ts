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
    console.log('🔧 Setting up Swagger documentation...');
    
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

    // Serve swagger docs JSON first
    app.get('/api-docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(specs);
    });

    // Use a simpler approach: Generate HTML with CDN assets instead of serving local files
    app.get('/api-docs', (req, res) => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>PostVector API Documentation</title>
          <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css" />
          <style>
            html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
            *, *:before, *:after { box-sizing: inherit; }
            body { margin:0; background: #fafafa; }
            .swagger-ui .topbar { display: none }
            .swagger-ui .info { margin: 50px 0 }
          </style>
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js"></script>
          <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-standalone-preset.js"></script>
          <script>
            window.onload = function() {
              const ui = SwaggerUIBundle({
                url: '/api-docs.json',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                  SwaggerUIBundle.presets.apis,
                  SwaggerUIStandalonePreset
                ],
                plugins: [
                  SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                docExpansion: 'none',
                filter: true,
                showRequestHeaders: true
              });
            };
          </script>
        </body>
        </html>
      `;
      
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    });

    console.log('✅ Swagger documentation setup complete');
    console.log('📖 API docs available at: /api-docs');
    console.log('📄 API spec available at: /api-docs.json');
  } catch (error) {
    console.error('❌ Failed to setup Swagger documentation:', error);
    console.error(error);
  }
}
