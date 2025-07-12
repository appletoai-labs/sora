// Rate limiting utilities
class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();

  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return true;
    }

    // Reset if window has passed
    if (now - record.lastAttempt > windowMs) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return true;
    }

    // Check if limit exceeded
    if (record.count >= maxAttempts) {
      return false;
    }

    // Increment counter
    record.count++;
    record.lastAttempt = now;
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }

  getRemainingTime(key: string, windowMs: number): number {
    const record = this.attempts.get(key);
    if (!record) return 0;
    
    const elapsed = Date.now() - record.lastAttempt;
    return Math.max(0, windowMs - elapsed);
  }
}

export const voiceConnectionLimiter = new RateLimiter();
export const authLimiter = new RateLimiter();

// Session management
export class SessionManager {
  private static WARNING_TIME = 5 * 60 * 1000; // 5 minutes
  private static TIMEOUT_TIME = 30 * 60 * 1000; // 30 minutes
  
  private warningTimer?: number;
  private timeoutTimer?: number;
  private onWarning?: () => void;
  private onTimeout?: () => void;

  constructor(onWarning?: () => void, onTimeout?: () => void) {
    this.onWarning = onWarning;
    this.onTimeout = onTimeout;
  }

  startSession(): void {
    this.resetTimers();
    
    // Set warning timer
    this.warningTimer = window.setTimeout(() => {
      this.onWarning?.();
    }, SessionManager.TIMEOUT_TIME - SessionManager.WARNING_TIME);

    // Set timeout timer
    this.timeoutTimer = window.setTimeout(() => {
      this.onTimeout?.();
    }, SessionManager.TIMEOUT_TIME);
  }

  extendSession(): void {
    this.resetTimers();
    this.startSession();
  }

  endSession(): void {
    this.resetTimers();
  }

  private resetTimers(): void {
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = undefined;
    }
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = undefined;
    }
  }
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .slice(0, 1000); // Limit length
}

// Security headers helper for edge functions
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
} as const;