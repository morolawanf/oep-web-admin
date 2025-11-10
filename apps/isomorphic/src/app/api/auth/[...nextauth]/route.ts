import NextAuth from 'next-auth';
import { authOptions } from './auth-options';
import { NextAuthHandlerParams, NextAuthHeader } from 'node_modules/next-auth/core';

const handler = NextAuth(authOptions);
const signOut = async (params?: NextAuthHandlerParams) => {  
    return await handler.signOut(params);
}
export { handler as GET, handler as POST, signOut };

