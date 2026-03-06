import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/lib/db.json');

export async function POST(request: Request) {
  const { email, amount } = await request.json();
  const fileData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  const userIndex = fileData.users.findIndex((u: any) => u.email === email);

  if (userIndex !== -1) {
    fileData.users[userIndex].points += amount;
    fs.writeFileSync(dbPath, JSON.stringify(fileData, null, 2));
    return NextResponse.json({ success: true, points: fileData.users[userIndex].points });
  }
  
  return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
}