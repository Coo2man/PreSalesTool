'use server';

import { cookies } from 'next/headers';
import { UserRole, signContextToken } from '@/lib/auth';

const CONTEXT_COOKIE_NAME = 'presales_user_context';

export async function setContextAction(role: UserRole) {
    const token = await signContextToken(role);

    // Set cookie
    cookies().set(CONTEXT_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
    });
}

export async function clearContextAction() {
    cookies().delete(CONTEXT_COOKIE_NAME);
}
