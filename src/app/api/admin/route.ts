import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/lib/db.json');

// GET: Fetch entire DB
export async function GET() {
  try {
    const fileData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    return NextResponse.json(fileData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read database" }, { status: 500 });
  }
}

// POST: Full Management (CRUD)
export async function POST(request: Request) {
  try {
    const { action, payload } = await request.json();
    const fileData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    switch (action) {
      // --- USER MANAGEMENT ---
      case 'UPDATE_POINTS':
        const uIdx = fileData.users.findIndex((u: any) => u.email === payload.email);
        if (uIdx !== -1) fileData.users[uIdx].points = payload.points;
        break;

      case 'ADD_USER':
        // Check if user already exists
        if (!fileData.users.find((u: any) => u.email === payload.email)) {
          fileData.users.push({
            email: payload.email,
            password: payload.password,
            points: payload.points || 0
          });
        }
        break;

      case 'DELETE_USER':
        fileData.users = fileData.users.filter((u: any) => u.email !== payload.email);
        // Also clean up their orders if you want to keep the DB small
        fileData.orders = fileData.orders.filter((o: any) => o.user_email !== payload.email);
        break;

      // --- THERAPIST MANAGEMENT ---
      case 'ADD_THERAPIST':
        fileData.therapists.push({
          id: Date.now(), // Generate unique ID
          name: payload.name,
          sales: 0,
          price: payload.price,
          old_price: payload.price + 50,
          avatar_emoji: payload.avatar_emoji || "👤",
          type: "instant"
        });
        break;

      case 'DELETE_THERAPIST':
        fileData.therapists = fileData.therapists.filter((t: any) => t.id !== payload.id);
        break;

      // --- ORDER MANAGEMENT ---
      case 'UPDATE_ORDER_STATUS':
        const oIdx = fileData.orders.findIndex((o: any) => o.id === payload.id);
        if (oIdx !== -1) fileData.orders[oIdx].status = payload.status;
        break;

      default:
        return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 });
    }

    // Write the updated object back to the JSON file
    fs.writeFileSync(dbPath, JSON.stringify(fileData, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin API Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}