import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/lib/db.json');

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  
  const fileData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const userOrders = fileData.orders.filter((o: any) => o.user_email === email);

  return NextResponse.json(userOrders);
}