import mongoose from 'mongoose';

/**
 * Runs operations within a MongoDB transaction session.
 * Automatically falls back to a non-transactional run if the database is standalone (no replica set support).
 * 
 * @param {Function} operations - async (session) => { ... }
 * @returns {Promise<any>}
 */
export const runWithTransaction = async (operations) => {
  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
    
    // Execute user operations within transaction
    const result = await operations(session);
    
    await session.commitTransaction();
    return result;
  } catch (error) {
    if (session) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        // Suppress errors during abort
      }
    }

    // Check for MongoDB standalone replica set limitation
    const isReplicaSetError =
      error.message?.includes('replica set') ||
      error.message?.includes('Transaction numbers') ||
      error.code === 20 ||
      error.codeName === 'IllegalOperation';

    if (isReplicaSetError) {
      console.warn(
        '[Transaction Fallback] Standalone local MongoDB detected without replica sets. Retrying operation without transaction session.'
      );
      // Fallback: retry operations passing null session
      return await operations(null);
    }

    // Propagate all other database or logic errors
    throw error;
  } finally {
    if (session) {
      session.endSession();
    }
  }
};
