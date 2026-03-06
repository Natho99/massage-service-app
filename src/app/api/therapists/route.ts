import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/lib/db.json');

export async function GET() {
  const fileData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  // Return the therapists list directly from the JSON
  return NextResponse.json(fileData.therapists || []);
}