import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

// GET: Fetch entire DB from Cloud
export async function GET() {
  try {
    const store = getStore('site-data');
    const fileData = await store.get('db', { type: 'json' });
    
    if (!fileData) {
      return NextResponse.json({ error: "Cloud database not found" }, { status: 404 });
    }
    
    return NextResponse.json(fileData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read cloud database" }, { status: 500 });
  }
}

// POST: Full Management (CRUD) via Cloud
export async function POST(request: Request) {
  try {
    const { action, payload } = await request.json();
    const store = getStore('site-data');
    
    // 1. Get current state from cloud
    let fileData: any = await store.get('db', { type: 'json' });

    if (!fileData) {
      return NextResponse.json({ success: false, message: "Database not initialized" }, { status: 500 });
    }

    // 2. Perform logic based on action
    switch (action) {
      case 'UPDATE_POINTS':
        const uIdx = fileData.users.findIndex((u: any) => u.email === payload.email);
        if (uIdx !== -1) fileData.users[uIdx].points = payload.points;
        break;

      case 'ADD_USER':
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
        fileData.orders = fileData.orders.filter((o: any) => o.user_email !== payload.email);
        break;

      case 'ADD_THERAPIST':
        fileData.therapists.push({
          id: Date.now(),
          name: payload.name,
          sales: 0,
          price: payload.price,
          old_price: (Number(payload.price) || 0) + 50,
          avatar_emoji: payload.avatar_emoji || "👤",
          type: "instant"
        });
        break;

      case 'DELETE_THERAPIST':
        fileData.therapists = fileData.therapists.filter((t: any) => t.id !== payload.id);
        break;

      case 'UPDATE_ORDER_STATUS':
        const oIdx = fileData.orders.findIndex((o: any) => o.id === payload.id);
        if (oIdx !== -1) fileData.orders[oIdx].status = payload.status;
        break;

      default:
        return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 });
    }

    // 3. Save the updated object back to the Cloud (Replaces fs.writeFileSync)
    await store.setJSON('db', fileData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin API Error:", error);
    return NextResponse.json({ success: false, message: "Cloud Update Failed" }, { status: 500 });
  }
}