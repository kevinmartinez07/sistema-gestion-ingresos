import { PrismaClient } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendVerificationEmail: async ({
      user,
      url,
    }: {
      user: { email: string; name: string };
      url: string;
    }) => {
      const emailHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Bienvenido a Sistema de Gestión</h1>
              </div>
              <div class="content">
                <p>Hola <strong>${user.name}</strong>,</p>
                <p>Gracias por registrarte. Por favor verifica tu email haciendo clic en el siguiente botón:</p>
                <center>
                  <a href="${url}" class="button">Verificar Email</a>
                </center>
                <p style="margin-top: 20px; color: #666; font-size: 14px;">
                  O copia y pega este enlace en tu navegador:<br>
                  <code style="background: #e0e0e0; padding: 5px 10px; border-radius: 3px; display: inline-block; margin-top: 5px;">${url}</code>
                </p>
                <p style="margin-top: 20px; color: #999; font-size: 12px;">
                  Este enlace expirará en 24 horas.
                </p>
              </div>
              <div class="footer">
                <p>Si no solicitaste este registro, puedes ignorar este email.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      // Modo desarrollo: Mostrar en consola
      if (!process.env.MAILTRAP_TOKEN) {
        /* eslint-disable no-console */
        console.log('\n[EMAIL] Verificación (Modo Desarrollo):\n');
        console.log(`Para: ${user.email}`);
        console.log(`Asunto: Verifica tu email - Sistema de Gestión`);
        console.log(`Link: ${url}\n`);
        /* eslint-enable no-console */
        return;
      }

      // Modo Mailtrap con cliente oficial
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { MailtrapClient } = require('mailtrap');

        const client = new MailtrapClient({
          token: process.env.MAILTRAP_TOKEN,
        });

        const sender = {
          email: process.env.EMAIL_FROM || 'noreply@sistema-gestion.com',
          name: 'Sistema de Gestión',
        };

        await client.send({
          from: sender,
          to: [{ email: user.email }],
          subject: 'Verifica tu email - Sistema de Gestión',
          html: emailHTML,
          category: 'Email Verification',
        });

        /* eslint-disable no-console */
        console.log(
          `[SUCCESS] Email de verificación enviado a ${user.email} via Mailtrap`
        );
        /* eslint-enable no-console */
      } catch (error) {
        /* eslint-disable no-console */
        console.error('[ERROR] Error enviando email:', error);
        /* eslint-enable no-console */
        throw error;
      }
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          id: profile.id.toString(),
          email: profile.email || '',
          name: profile.name || profile.login,
          image: profile.avatar_url,
          emailVerified: !!profile.email,
        };
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'ADMIN',
        required: true,
      },
      phone: {
        type: 'string',
        required: false,
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
