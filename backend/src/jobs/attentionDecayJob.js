/**
 * Attention Decay Job
 * Tracks repeat alerts across consecutive visits.
 * If an alert fires repeatedly and the user ignores it, decay its urgency
 * while keeping it transparent to the user.
 */

class AttentionDecayManager {
  constructor() {
    // In-memory visit streak tracking per user+symbol
    this.alertStreak = new Map(); // key: `${userId}_${symbol}` -> { count: number, lastScore: number }
  }

  /**
   * Evaluate decay for an alert that repeatedly fired
   */
  evaluateDecay(userId, symbol, currentScore, fingerprint) {
    const key = `${userId}_${symbol}`;
    const entry = this.alertStreak.get(key) || { count: 0, lastScore: currentScore };

    if (currentScore >= 70) {
      // Increment streak
      entry.count += 1;
      entry.lastScore = currentScore;
      this.alertStreak.set(key, entry);

      if (entry.count >= 2) {
        // Apply 15% decay per repeat occurrence, floor at 45 (WORTH CHECKING bucket)
        const decayFactor = Math.max(0.60, 1.0 - (entry.count - 1) * 0.15);
        const decayedScore = Math.max(45, Math.round(currentScore * decayFactor));

        return {
          isDecayed: true,
          originalScore: currentScore,
          decayedScore,
          streakCount: entry.count,
          decayNotice: `You've seen this ${entry.count} times without interaction — we've quietened it to protect your attention.`
        };
      }
    } else {
      // Reset streak if condition abated
      this.alertStreak.delete(key);
    }

    return {
      isDecayed: false,
      decayedScore: currentScore,
      streakCount: entry.count,
      decayNotice: null
    };
  }

  resetStreak(userId, symbol) {
    this.alertStreak.delete(`${userId}_${symbol}`);
  }
}

const attentionDecayManager = new AttentionDecayManager();

module.exports = attentionDecayManager;
