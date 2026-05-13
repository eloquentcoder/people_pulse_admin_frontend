import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from './useAppDispatch';
import { clearCredentials } from '@/domains/auth/login/slices/auth.slice';

interface UseInactivityTimeoutOptions {
  /** Timeout in minutes before showing warning (default: 25 minutes) */
  timeoutMinutes?: number;
  /** Warning duration in seconds before auto-logout (default: 60 seconds) */
  warningDurationSeconds?: number;
  /** Whether the timeout is enabled (default: true) */
  enabled?: boolean;
}

interface UseInactivityTimeoutReturn {
  /** Whether the warning modal should be shown */
  showWarning: boolean;
  /** Seconds remaining before auto-logout */
  secondsRemaining: number;
  /** Call to continue the session (resets the timer) */
  continueSession: () => void;
  /** Call to logout immediately */
  logoutNow: () => void;
}

const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keydown',
  'scroll',
  'touchstart',
  'click',
  'wheel',
] as const;

export function useInactivityTimeout(
  options: UseInactivityTimeoutOptions = {}
): UseInactivityTimeoutReturn {
  const {
    timeoutMinutes = 25,
    warningDurationSeconds = 60,
    enabled = true,
  } = options;

  const [showWarning, setShowWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(warningDurationSeconds);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const performLogout = useCallback(() => {
    // Clear all timers
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    // Clear auth state
    dispatch(clearCredentials());

    // Navigate to login with a message
    navigate('/login', {
      state: { message: 'You have been logged out due to inactivity.' }
    });
  }, [dispatch, navigate]);

  const startWarningCountdown = useCallback(() => {
    setShowWarning(true);
    setSecondsRemaining(warningDurationSeconds);

    // Clear any existing countdown
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    countdownIntervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Time's up - logout
          performLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [warningDurationSeconds, performLogout]);

  const resetInactivityTimer = useCallback(() => {
    lastActivityRef.current = Date.now();

    // Clear existing inactivity timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Only start timer if warning is not showing
    if (!showWarning) {
      inactivityTimerRef.current = setTimeout(() => {
        startWarningCountdown();
      }, timeoutMinutes * 60 * 1000);
    }
  }, [timeoutMinutes, showWarning, startWarningCountdown]);

  const continueSession = useCallback(() => {
    // Clear countdown
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    // Hide warning
    setShowWarning(false);
    setSecondsRemaining(warningDurationSeconds);

    // Reset the inactivity timer
    lastActivityRef.current = Date.now();

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      startWarningCountdown();
    }, timeoutMinutes * 60 * 1000);
  }, [timeoutMinutes, warningDurationSeconds, startWarningCountdown]);

  const logoutNow = useCallback(() => {
    performLogout();
  }, [performLogout]);

  // Handle activity events
  useEffect(() => {
    if (!enabled) return;

    const handleActivity = () => {
      // Only reset timer if warning is not showing
      if (!showWarning) {
        resetInactivityTimer();
      }
    };

    // Add event listeners
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Also listen for visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !showWarning) {
        // Check if we should show warning based on time elapsed
        const elapsed = Date.now() - lastActivityRef.current;
        const timeoutMs = timeoutMinutes * 60 * 1000;

        if (elapsed >= timeoutMs) {
          startWarningCountdown();
        } else {
          resetInactivityTimer();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start initial timer
    resetInactivityTimer();

    return () => {
      // Remove event listeners
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      // Clear timers
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [enabled, showWarning, timeoutMinutes, resetInactivityTimer, startWarningCountdown]);

  return {
    showWarning,
    secondsRemaining,
    continueSession,
    logoutNow,
  };
}
