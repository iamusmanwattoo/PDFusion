
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import bcryptjs from 'bcryptjs';

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

    await addDoc(usersRef, {
      email: normalizedEmail,
      passwordHash: passwordHash,
      createdAt: serverTimestamp(),
      mergeCount: 0,
      lastMergeDate: null,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}
