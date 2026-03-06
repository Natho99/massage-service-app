import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/lib/db.json');

export async function POST(request: Request) {
  try {
    const { email, therapist, appointment } = await request.json();
    
    // Read current database
    const fileData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // 1. Find User and check balance
    const userIndex = fileData.users.findIndex((u: any) => u.email === email);
    if (userIndex === -1) {
      return NextResponse.json({ success: false, message: "用户不存在" }, { status: 404 });
    }

    const user = fileData.users[userIndex];
    if (user.points < therapist.price) {
      return NextResponse.json({ success: false, message: "点数不足，请充值" }, { status: 400 });
    }

    // 2. Perform Transaction: Deduct points
    fileData.users[userIndex].points -= therapist.price;

    // 3. Create New Order Entry
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

    // 4. Save to JSON
    fileData.orders.push(newOrder);
    fs.writeFileSync(dbPath, JSON.stringify(fileData, null, 2));

    return NextResponse.json({ 
      success: true, 
      newPoints: fileData.users[userIndex].points 
    });

  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ success: false, message: "服务器内部错误" }, { status: 500 });
  }
}