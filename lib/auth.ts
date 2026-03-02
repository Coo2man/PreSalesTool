import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'a-very-secret-key-for-presales-toolbox-development';
const key = new TextEncoder().encode(secretKey);

export type UserRole = 'Data Center Consultant' | 'Network Consultant' | 'Backoffice';

export async function signContextToken(role: UserRole): Promise<string> {
    const token = await new SignJWT({ role })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('30d') // Context valid for 30 days
        .sign(key);

    return token;
}

export async function verifyContextToken(token: string): Promise<UserRole | null> {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
        });

        if (payload && typeof payload.role === 'string') {
            return payload.role as UserRole;
        }
        return null;
    } catch (error) {
        return null; // Invalid or expired token
    }
}
