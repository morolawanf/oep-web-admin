import NextAuth from 'next-auth';
import { authOptions } from './auth-options';
import { NextAuthHandlerParams, NextAuthHeader } from 'node_modules/next-auth/core';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
