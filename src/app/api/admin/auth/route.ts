import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Connect to the Netlify Blob Store you initialized via CLI
    const store = getStore('site-data');
    
    // 2. Fetch the JSON data from the cloud
    const fileData: any = await store.get('db', { type: 'json' });

    if (!fileData) {
      return NextResponse.json({ 
        success: false, 
        message: "Database not found in cloud storage" 
      }, { status: 500 });
    }

    // 3. Check Admin credentials against the cloud data
    const isAdmin = fileData.admins.find(
      (a: any) => a.email === email && a.password === password
    );

    if (isAdmin) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ 
      success: false, 
      message: "Unauthorized Access: Invalid Admin Credentials" 
    }, { status: 401 });

  } catch (error) {
    console.error("Admin Login Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Cloud Connection Error" 
    }, { status: 500 });
  }
}