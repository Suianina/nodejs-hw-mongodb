import { Session } from '../db/models/session.js';

export const cleanupExpiredSessions = async () => {
  try {
    const result = await Session.deleteMany({
      refreshTokenValidUntil: { $lt: new Date() },
    });

    console.log(`Expired sessions deleted: ${result.deletedCount}`);
  } catch (error) {
    console.error('❌ Failed to clean up sessions:', error);
  }
};
