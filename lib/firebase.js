import admin from 'firebase-admin';

if (!admin.apps.length) {
    if (process.env.FIREBASE_PRIVATE_KEY) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                }),
            });
        } catch (error) {
            console.error('Firebase admin initialization error', error.stack);
        }
    } else {
        console.warn('Firebase credentials not found. Skipping initialization.');
    }
}

let db;
try {
    db = admin.firestore();
} catch (error) {
    // Return a mock db that throws an error when used, to prevent build failures
    // but ensure runtime failures if credentials are strictly missing when needed.
    db = {
        collection: () => ({
            add: async () => {
                throw new Error('Firebase not initialized. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.');
            },
        }),
    };
}

export { db };
