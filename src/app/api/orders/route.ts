import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // 1. Connect to the Netlify Blob Store
    const store = getStore('site-data');
    
    // 2. Fetch the JSON data from the cloud store
    const fileData: any = await store.get('db', { type: 'json' });

    // Handle case where store might be empty
    if (!fileData || !fileData.orders) {
      return NextResponse.json([]);
    }

    // 3. Filter orders by email
    // If no email is provided, return all (useful for Admin view)
    if (!email) {
      return NextResponse.json(fileData.orders);
    }

    const userOrders = fileData.orders.filter((o: any) => o.user_email === email);

    return NextResponse.json(userOrders);
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json({ error: "Cloud Fetch Failed" }, { status: 500 });
  }
}