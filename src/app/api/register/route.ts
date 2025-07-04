
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import bcryptjs from 'bcryptjs';
import * as jose from 'jose';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const usersRef = collection(db, 'users');
    
    const q = query(usersRef, where('email', '==', normalizedEmail));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(password, salt);

    const newUserRef = await addDoc(usersRef, {
      email: normalizedEmail,
      passwordHash: passwordHash,
      createdAt: serverTimestamp(),
      mergeCount: 0,
      lastMergeDate: null,
    });
    
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined');
      return NextResponse.json({ error: 'Internal server configuration error' }, { status: 500 });
    }

    const secret = new TextEncoder().encode(jwtSecret);
    const token = await new jose.SignJWT({ userId: newUserRef.id, email: normalizedEmail })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);
      
    cookies().set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}
