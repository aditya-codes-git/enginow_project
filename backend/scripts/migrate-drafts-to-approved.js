/**
 * Temporary dev migration: promote all draft events to approved + public.
 * 
 * Usage:
 *   node scripts/migrate-drafts-to-approved.js
 * 
 * Safe to re-run. Only affects events with status "draft".
 * Will be removed when admin moderation is re-enabled.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('❌ No MONGO_URI found in .env');
  process.exit(1);
}

async function migrate() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const db = mongoose.connection.db;
  const result = await db.collection('events').updateMany(
    { status: 'draft' },
    { $set: { status: 'approved', visibility: 'public' } }
  );

  console.log(`✅ Updated ${result.modifiedCount} draft events → approved + public`);

  // Also promote any pending events
  const pendingResult = await db.collection('events').updateMany(
    { status: 'pending' },
    { $set: { status: 'approved', visibility: 'public' } }
  );

  console.log(`✅ Updated ${pendingResult.modifiedCount} pending events → approved + public`);

  await mongoose.disconnect();
  console.log('✅ Done. Disconnected.');
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
