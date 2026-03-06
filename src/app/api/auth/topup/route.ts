import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

export async function POST(request: Request) {
  try {
    const { email, amount } = await request.json();

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

    // 3. Find the user by email
    const userIndex = fileData.users.findIndex((u: any) => u.email === email);

    if (userIndex !== -1) {
      // 4. Update the points in the cloud object
      fileData.users[userIndex].points += Number(amount);

      // 5. SAVE BACK TO CLOUD (Replaces fs.writeFileSync)
      await store.setJSON('db', fileData);

      return NextResponse.json({ 
        success: true, 
        points: fileData.users[userIndex].points 
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: "User not found" 
    }, { status: 404 });

  } catch (error) {
    console.error("Top-up API Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Cloud Sync Failed" 
    }, { status: 500 });
  }
}