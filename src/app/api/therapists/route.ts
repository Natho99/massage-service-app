import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

export async function GET() {
  try {
    // 1. Connect to the Netlify Blob Store
    const store = getStore('site-data');
    
    // 2. Fetch the JSON data from the cloud store
    const fileData: any = await store.get('db', { type: 'json' });

    // Handle case where store might be empty or missing therapists
    if (!fileData || !fileData.therapists) {
      // If the cloud is empty, we return an empty array to prevent frontend crashes
      return NextResponse.json([]);
    }

    // 3. Return the live therapists list from the cloud
    return NextResponse.json(fileData.therapists);
    
  } catch (error) {
    console.error("Fetch Therapists Error:", error);
    // Return a 500 error if the cloud connection fails
    return NextResponse.json({ error: "Cloud Fetch Failed" }, { status: 500 });
  }
}