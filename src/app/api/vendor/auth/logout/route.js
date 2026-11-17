import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get('vendorAuthToken');
    
    if (!authToken) {
      return NextResponse.json({ message: 'User not logged in' }, { status: 400 });
    }

    const response = NextResponse.json({ message: 'Logout successful' });

    response.cookies.set('vendorAuthToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0), // Expire the cookie immediately
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Logout failed', error: error.message }, { status: 500 });
  }
}
