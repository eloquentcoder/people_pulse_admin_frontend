import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/common/components/ui/alert-dialog';
import { Clock } from 'lucide-react';

interface InactivityWarningModalProps {
  open: boolean;
  secondsRemaining: number;
  onContinue: () => void;
  onLogout: () => void;
}

export function InactivityWarningModal({
  open,
  secondsRemaining,
  onContinue,
  onLogout,
}: InactivityWarningModalProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${secs} seconds`;
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <AlertDialogTitle className="text-center">
            Session Timeout Warning
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Your session is about to expire due to inactivity. You will be
            automatically logged out in{' '}
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {formatTime(secondsRemaining)}
            </span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center gap-3">
          <AlertDialogCancel onClick={onLogout}>
            Log Out Now
          </AlertDialogCancel>
          <AlertDialogAction onClick={onContinue}>
            Stay Logged In
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
