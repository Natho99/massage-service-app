import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Connect to the Netlify Blob Store
    const store = getStore('site-data');
    
    // 2. Fetch the JSON data from the cloud
    const fileData: any = await store.get('db', { type: 'json' });

    if (!fileData) {
      return NextResponse.json({ 
        success: false, 
        message: "Database initialization required." 
      }, { status: 500 });
    }

    // 3. Find the user in the cloud data
    const user = fileData.users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (user) {
      // Return user data including the latest points balance
      return NextResponse.json({ 
        success: true, 
        user: { 
          email: user.email, 
          points: user.points 
        } 
      });
    }

    return NextResponse.json({ 
      success: false, 
      message: "邮箱或密码错误" 
    }, { status: 401 });

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Cloud Connection Failure" 
    }, { status: 500 });
  }
}