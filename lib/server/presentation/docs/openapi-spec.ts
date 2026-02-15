export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Sistema de Gestión de Ingresos y Egresos API',
    version: '1.0.0',
    description:
      'API RESTful para gestión de movimientos financieros, usuarios y reportes',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desarrollo',
    },
    {
      url: 'https://your-app.vercel.app',
      description: 'Servidor de producción',
    },
  ],
  tags: [
    {
      name: 'Movements',
      description: 'Endpoints para gestión de movimientos financieros',
    },
    {
      name: 'Users',
      description: 'Endpoints para gestión de usuarios (solo ADMIN)',
    },
    {
      name: 'Reports',
      description: 'Endpoints para reportes y análisis (solo ADMIN)',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'better-auth.session_token',
      },
    },
    schemas: {
      Movement: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID único del movimiento',
            example: 'clx123abc456',
          },
          type: {
            type: 'string',
            enum: ['INCOME', 'EXPENSE'],
            description: 'Tipo de movimiento',
            example: 'INCOME',
          },
          amount: {
            type: 'number',
            format: 'double',
            description: 'Monto del movimiento',
            example: 1500.5,
          },
          concept: {
            type: 'string',
            description: 'Concepto o descripción del movimiento',
            example: 'Venta de producto',
          },
          date: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha del movimiento',
            example: '2026-02-14T10:00:00Z',
          },
          userId: {
            type: 'string',
            description: 'ID del usuario que creó el movimiento',
            example: 'clx789def012',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de creación del registro',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de última actualización',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID único del usuario',
            example: 'clx789def012',
          },
          name: {
            type: 'string',
            description: 'Nombre completo del usuario',
            example: 'Juan Pérez',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Correo electrónico del usuario',
            example: 'juan@example.com',
          },
          phone: {
            type: 'string',
            nullable: true,
            description: 'Teléfono del usuario',
            example: '+57 300 123 4567',
          },
          role: {
            type: 'string',
            enum: ['ADMIN', 'USER'],
            description: 'Rol del usuario',
            example: 'ADMIN',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de creación',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de última actualización',
          },
        },
      },
      Balance: {
        type: 'object',
        properties: {
          totalIncome: {
            type: 'number',
            description: 'Total de ingresos',
            example: 10000.0,
          },
          totalExpense: {
            type: 'number',
            description: 'Total de egresos',
            example: 3500.0,
          },
          balance: {
            type: 'number',
            description: 'Balance (ingresos - egresos)',
            example: 6500.0,
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'string',
            description: 'Mensaje de error',
            example: 'Unauthorized',
          },
        },
      },
    },
  },
  paths: {
    '/api/movements': {
      get: {
        tags: ['Movements'],
        summary: 'Obtener lista de movimientos',
        description:
          'Retorna todos los movimientos financieros con filtros opcionales',
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: 'type',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['INCOME', 'EXPENSE'],
            },
            description: 'Filtrar por tipo de movimiento',
          },
          {
            name: 'startDate',
            in: 'query',
            schema: {
              type: 'string',
              format: 'date',
            },
            description: 'Fecha de inicio para filtrar',
          },
          {
            name: 'endDate',
            in: 'query',
            schema: {
              type: 'string',
              format: 'date',
            },
            description: 'Fecha de fin para filtrar',
          },
        ],
        responses: {
          '200': {
            description: 'Lista de movimientos obtenida exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Movement',
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'No autorizado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Movements'],
        summary: 'Crear un nuevo movimiento',
        description: 'Crea un nuevo movimiento financiero (solo ADMIN)',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['type', 'amount', 'concept', 'date'],
                properties: {
                  type: {
                    type: 'string',
                    enum: ['INCOME', 'EXPENSE'],
                    example: 'INCOME',
                  },
                  amount: {
                    type: 'number',
                    format: 'double',
                    example: 1500.5,
                  },
                  concept: {
                    type: 'string',
                    example: 'Venta de producto',
                  },
                  date: {
                    type: 'string',
                    format: 'date',
                    example: '2026-02-14',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Movimiento creado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    data: {
                      $ref: '#/components/schemas/Movement',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Datos inválidos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '401': {
            description: 'No autorizado',
          },
          '403': {
            description: 'Prohibido - Solo ADMIN puede crear movimientos',
          },
        },
      },
    },
    '/api/movements/{id}': {
      delete: {
        tags: ['Movements'],
        summary: 'Eliminar un movimiento',
        description: 'Elimina un movimiento por su ID (solo ADMIN)',
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'ID del movimiento a eliminar',
          },
        ],
        responses: {
          '200': {
            description: 'Movimiento eliminado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Movement deleted successfully',
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'No autorizado',
          },
          '403': {
            description: 'Prohibido - Solo ADMIN puede eliminar movimientos',
          },
          '404': {
            description: 'Movimiento no encontrado',
          },
        },
      },
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'Obtener lista de usuarios',
        description: 'Retorna todos los usuarios del sistema (solo ADMIN)',
        security: [{ cookieAuth: [] }],
        responses: {
          '200': {
            description: 'Lista de usuarios obtenida exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/User',
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'No autorizado',
          },
          '403': {
            description: 'Prohibido - Solo ADMIN puede acceder',
          },
        },
      },
    },
    '/api/users/{id}': {
      put: {
        tags: ['Users'],
        summary: 'Actualizar un usuario',
        description: 'Actualiza la información de un usuario (solo ADMIN)',
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'ID del usuario a actualizar',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Juan Pérez Actualizado',
                  },
                  role: {
                    type: 'string',
                    enum: ['ADMIN', 'USER'],
                    example: 'USER',
                  },
                  phone: {
                    type: 'string',
                    nullable: true,
                    example: '+57 300 123 4567',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Usuario actualizado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    data: {
                      $ref: '#/components/schemas/User',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Datos inválidos',
          },
          '401': {
            description: 'No autorizado',
          },
          '403': {
            description: 'Prohibido - Solo ADMIN puede actualizar usuarios',
          },
          '404': {
            description: 'Usuario no encontrado',
          },
        },
      },
    },
    '/api/reports': {
      get: {
        tags: ['Reports'],
        summary: 'Obtener reporte de movimientos',
        description:
          'Retorna datos de balance y movimientos. Si se especifica format=csv, descarga un archivo CSV',
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: 'format',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['json', 'csv'],
            },
            description:
              'Formato de respuesta (json por defecto, csv para descargar)',
          },
        ],
        responses: {
          '200': {
            description: 'Reporte obtenido exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    data: {
                      type: 'object',
                      properties: {
                        balance: {
                          $ref: '#/components/schemas/Balance',
                        },
                        movements: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/Movement',
                          },
                        },
                      },
                    },
                  },
                },
              },
              'text/csv': {
                schema: {
                  type: 'string',
                  example:
                    'ID,Tipo,Monto,Concepto,Fecha,Usuario,Creado\\nclx123,INCOME,1500.50,"Venta",2026-02-14,...',
                },
              },
            },
          },
          '401': {
            description: 'No autorizado',
          },
          '403': {
            description: 'Prohibido - Solo ADMIN puede acceder a reportes',
          },
        },
      },
    },
  },
};
