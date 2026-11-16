import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
    try {
        if (!process.env.JWT_SECRET) {
            console.error('Vendor login unavailable: JWT_SECRET is not configured.');
            return NextResponse.json({ msg: "Login is temporarily unavailable." }, { status: 503 });
        }

        const { email, password, rememberMe } = await req.json();

        const user = await (await import('@/lib/prisma')).default.user.findUnique({ where: { email } });

        if (!user || !user.passwordHash) {
            return NextResponse.json({ msg: "Invalid email or password" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return NextResponse.json({ msg: "Invalid email or password" }, { status: 401 });
        }

        if (user.status !== 'ACTIVE') {
            return NextResponse.json({ msg: "Not Authorised" }, { status: 403 });
        }

        if (user.role !== 'VENDOR') {
            return NextResponse.json({ msg: "Not Authorised" }, { status: 403 });
        }

        const token = generateToken({ id: String(user.id || user._id), email: user.email });

        const response = NextResponse.json({ msg: "Login successful" }, { status: 200 });

        response.cookies.set('vendorAuthToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',
            maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7, // 1 month if 'rememberMe', otherwise 1 week
            path: '/'
        });

        return response;

    } catch (error) {
        console.error('Error processing login:', error);
        return NextResponse.json({ msg: "Unable to process login right now." }, { status: 500 });
    }
};

// Function to generate a JWT token
function generateToken(user) {
    console.log('Generating token for user:', user);
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1w' });
}
