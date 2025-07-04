
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import * as jose from 'jose';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/components/ui/table';

const ADMIN_EMAIL = 'admin@pdfusion.com';

type User = {
  id: string;
  email: string;
  passwordHash: string;
  mergeCount: number;
  createdAt: string;
};

async function getUsers(): Promise<User[]> {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  const users: User[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const createdAtDate = data.createdAt instanceof Timestamp 
      ? data.createdAt.toDate() 
      : new Date();
      
    users.push({
      id: doc.id,
      email: data.email || 'N/A',
      passwordHash: data.passwordHash ? 'Stored' : 'Not Set',
      mergeCount: data.mergeCount || 0,
      createdAt: createdAtDate.toLocaleString(),
    });
  });
  return users;
}


export default async function AdminPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get('auth-token')?.value;

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET not configured');
    redirect('/');
  }
  
  if (!authToken) {
    redirect('/login');
  }

  try {
    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jose.jwtVerify(authToken, secret);

    if (payload.email !== ADMIN_EMAIL) {
      redirect('/');
    }
  } catch (error) {
    redirect('/login');
  }

  const users = await getUsers();

  return (
    <div className="flex flex-col flex-grow bg-background">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-foreground mb-6">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          A list of all registered users in the system.
        </p>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <Table>
            {users.length === 0 && (
                <TableCaption>No users found in the database.</TableCaption>
            )}
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Password Status</TableHead>
                <TableHead className="text-center">Merge Count</TableHead>
                <TableHead className="text-right">Registered On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.passwordHash}</TableCell>
                  <TableCell className="text-center">{user.mergeCount}</TableCell>
                  <TableCell className="text-right">{user.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
