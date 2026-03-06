import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/lib/db.json');

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const fileData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  const isAdmin = fileData.admins.find(
    (a: any) => a.email === email && a.password === password
  );

  if (isAdmin) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false, message: "Unauthorized Access" }, { status: 401 });
}