import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

export async function POST(request: Request) {
  try {
    const { email, toolTitle, cost } = await request.json();

    // 1. Connect to the Netlify Blob Store
    const store = getStore('site-data');
    
    // 2. Fetch the JSON data from the cloud
    let fileData: any = await store.get('db', { type: 'json' });

    if (!fileData) {
      return NextResponse.json({ 
        success: false, 
        message: "Database not initialized" 
      }, { status: 500 });
    }

    // 3. Find the user
    const userIndex = fileData.users.findIndex((u: any) => u.email === email);
    if (userIndex === -1) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // 4. Check points balance
    if (fileData.users[userIndex].points < cost) {
      return NextResponse.json({ success: false, message: "余额不足" }, { status: 400 });
    }

    // 5. Deduct points for tool usage
    fileData.users[userIndex].points -= cost;

    // 6. Record to Order History (so it shows in Mine Tab)
    fileData.orders.push({
      id: `tool_${Date.now()}`,
      user_email: email,
      therapist_name: toolTitle,
      img: "✨",
      price: cost,
      status: "complete",
      date: new Date().toISOString().split('T')[0]
    });

    // 7. SAVE TO CLOUD (Replaces fs.writeFileSync)
    await store.setJSON('db', fileData);

    return NextResponse.json({ 
      success: true, 
      newPoints: fileData.users[userIndex].points 
    });

  } catch (error) {
    console.error("Beautify API Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Cloud Sync Failed" 
    }, { status: 500 });
  }
}