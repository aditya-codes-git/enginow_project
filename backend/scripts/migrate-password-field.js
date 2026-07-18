/**
 * Migration: rename `password` -> `passwordHash` on legacy user documents
 *
 * Run once from the backend directory:
 *   node scripts/migrate-password-field.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI is not set in .env');
  process.exit(1);
}

await mongoose.connect(MONGO_URI);
console.log('Connected to MongoDB');

const db = mongoose.connection.db;
const users = db.collection('users');

// Find all documents that have a `password` field but no `passwordHash` field
const result = await users.updateMany(
  { password: { $exists: true }, passwordHash: { $exists: false } },
  [{ $set: { passwordHash: '$password' } }, { $unset: 'password' }]
);

console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);

// Also handle documents that have neither field (broken accounts)
const broken = await users.countDocuments({
  password: { $exists: false },
  passwordHash: { $exists: false },
});
if (broken > 0) {
  console.warn(`${broken} user document(s) have no password field at all — they will need to reset their password.`);
}

await mongoose.disconnect();
console.log('Done.');
