import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

export async function POST(request: Request) {
  try {
    const { email, therapist, appointment } = await request.json();
    
    // 1. Connect to the Netlify Blob Store
    const store = getStore('site-data');
    
    // 2. Fetch the JSON data from the cloud
    let fileData: any = await store.get('db', { type: 'json' });

    if (!fileData) {
      return NextResponse.json({ 
        success: false, 
        message: "Database not initialized in cloud" 
      }, { status: 500 });
    }
    
    // 3. Find User and check balance
    const userIndex = fileData.users.findIndex((u: any) => u.email === email);
    if (userIndex === -1) {
      return NextResponse.json({ success: false, message: "用户不存在" }, { status: 404 });
    }

    const user = fileData.users[userIndex];
    if (user.points < therapist.price) {
      return NextResponse.json({ success: false, message: "点数不足，请充值" }, { status: 400 });
    }

    // 4. Perform Transaction: Deduct points from the cloud object
    fileData.users[userIndex].points -= therapist.price;

    // 5. Create New Order Entry
    const newOrder = {
      id: `ord_${Date.now()}`,
      user_email: email,
      therapist_name: therapist.name,
      img: therapist.avatar_emoji,
      price: therapist.price,
      status: therapist.type === 'preorder' ? 'pending' : 'complete',
      appointment_time: appointment || 'Instant',
      date: new Date().toISOString().split('T')[0]
    };

    // 6. Save to Cloud (Replaces fs.writeFileSync)
    fileData.orders.push(newOrder);
    await store.setJSON('db', fileData);

    return NextResponse.json({ 
      success: true, 
      newPoints: fileData.users[userIndex].points 
    });

  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "服务器内部错误 (Cloud Sync Failed)" 
    }, { status: 500 });
  }
}