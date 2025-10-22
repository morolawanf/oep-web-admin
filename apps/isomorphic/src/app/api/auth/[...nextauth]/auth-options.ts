import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { pagesOptions } from './pages-options';
import APIRoutes from '@/libs/apiRoutes';

class InvalidLoginError extends Error {
  constructor() {
    super('Invalid identifier or password');
    this.name = 'InvalidLoginError';
  }
}

class AuthenticationFailedError extends Error {
  constructor(message?: string) {
    super(message || 'Authentication failed');
    this.name = 'AuthenticationFailedError';
  }
}

export const authOptions: NextAuthOptions = {
  // debug: true,
  pages: {
    ...pagesOptions,
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id as string;
        (session.user as any).token = token.token as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.token = (user as any).token;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }

      if (trigger === 'update' && session) {
        token.name = session.user.name;
        token.email = session.user.email;
      }

      return token;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const response = await fetch(APIRoutes.login, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          if (!response.ok) {
            if (response.status === 401) {
              throw new InvalidLoginError();
            }
            return null;
          }

          const res = await response.json() as {
            message: string;
            data: {
              emailVerified: null | Date;
              token: string;
              _id: string;
              name: string;
              email: string;
              image?: string;
            }
          };

          return {
            id: res.data._id,
            token: res.data.token,
            name: res.data.name,
            email: res.data.email,
            image: res.data.image,
            emailVerified: res.data.emailVerified,
          };
        } catch (error) {
          console.log('Error during credentials authorization:', error);
          if (error instanceof InvalidLoginError) {
            throw error;
          }
          throw new AuthenticationFailedError(
            error instanceof Error ? error.message : 'Unknown error'
          );
        }
      },
    }),
  ],
};
