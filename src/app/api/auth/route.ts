import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/lib/db.json');

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const fileData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  const user = fileData.users.find((u: any) => u.email === email && u.password === password);

  if (user) {
    return NextResponse.json({ success: true, user: { email: user.email, points: user.points } });
  }
  return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
}