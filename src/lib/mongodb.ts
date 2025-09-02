import { MongoClient, ServerApiVersion } from 'mongodb';

// Ensure MONGODB_URI is defined in your .env.local file
const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error('Please add your Mongo URI to .env.local');
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let clientPromise: Promise<MongoClient>;

// This prevents the client from being re-initialized on every hot reload in development
if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> };
    if (!globalWithMongo._mongoClientPromise) {
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    clientPromise = client.connect();
}

export default clientPromise;