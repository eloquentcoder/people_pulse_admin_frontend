import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { CalendarClock } from 'lucide-react';
import type { Subscription } from '../types';
import { computeExtendedTrialDate } from '../utils/extendTrial';

interface ExtendTrialDialogProps {
  open: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  onConfirm: (newTrialEndsAt: string) => void;
  loading?: boolean;
}

const PRESETS = [7, 14, 30];

export function ExtendTrialDialog({
  open,
  onClose,
  subscription,
  onConfirm,
  loading,
}: ExtendTrialDialogProps) {
  const [selectedDate, setSelectedDate] = useState('');

  // Reset the chosen date whenever the dialog is (re)opened for a subscription.
  useEffect(() => {
    if (open) {
      setSelectedDate('');
    }
  }, [open, subscription?.id]);

  const applyPreset = (days: number) => {
    setSelectedDate(computeExtendedTrialDate(subscription?.trial_ends_at, days));
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onConfirm(selectedDate);
    }
  };

  const currentTrialEnds = subscription?.trial_ends_at
    ? new Date(subscription.trial_ends_at).toLocaleDateString()
    : 'No trial end set';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Extend Trial
          </DialogTitle>
          <DialogDescription>
            Current trial ends: {currentTrialEnds}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Quick extend</Label>
            <div className="flex gap-2">
              {PRESETS.map((days) => (
                <Button
                  key={days}
                  type="button"
                  variant="outline"
                  onClick={() => applyPreset(days)}
                >
                  +{days} days
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="extend-trial-custom-date">Custom date</Label>
            <Input
              id="extend-trial-custom-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {selectedDate && (
            <p className="text-sm text-muted-foreground">
              New trial end:{' '}
              <span className="font-medium text-foreground">
                {new Date(selectedDate).toLocaleDateString()}
              </span>
            </p>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedDate || loading}
          >
            {loading ? 'Extending...' : 'Extend Trial'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
