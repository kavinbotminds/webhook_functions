import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function POST(request) {
    try {
        const body = await request.json();

        // Log the incoming data
        console.log('Received webhook data:', body);

        // Save to Firestore
        const collectionName = 'webhooks';
        const docRef = await db.collection(collectionName).add({
            payload: body,
            receivedAt: new Date().toISOString(),
        });

        console.log(`Document written with ID: ${docRef.id}`);

        return NextResponse.json({ message: 'Data received and stored', id: docRef.id }, { status: 200 });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
