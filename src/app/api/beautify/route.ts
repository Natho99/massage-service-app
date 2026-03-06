import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/lib/db.json');

export async function POST(request: Request) {
  const { email, toolTitle, cost } = await request.json();
  const fileData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  const userIndex = fileData.users.findIndex((u: any) => u.email === email);
  if (userIndex === -1) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

  if (fileData.users[userIndex].points < cost) {
    return NextResponse.json({ success: false, message: "余额不足" }, { status: 400 });
  }

  // Deduct points for tool usage
  fileData.users[userIndex].points -= cost;
  fs.writeFileSync(dbPath, JSON.stringify(fileData, null, 2));

  return NextResponse.json({ success: true, newPoints: fileData.users[userIndex].points });
}