import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/common/components/ui/dialog';
import { Badge } from '@/common/components/ui/badge';
import { auditActionColor } from '../models/audit-log.model';
import type { AuditLogEntry } from '../models/audit-log.model';

interface Props {
  log: AuditLogEntry | null;
  open: boolean;
  onClose: () => void;
}

const display = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

export const AuditLogDetailModal = ({ log, open, onClose }: Props) => {
  if (!log) return null;

  const keys = Array.from(
    new Set([...Object.keys(log.old_values ?? {}), ...Object.keys(log.new_values ?? {})]),
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge
              style={{
                color: auditActionColor(log.action_type),
                backgroundColor: `${auditActionColor(log.action_type)}1a`,
              }}
            >
              {log.event}
            </Badge>
            <span className="text-sm font-normal text-gray-500">
              {new Date(log.created_at).toLocaleString()}
            </span>
          </DialogTitle>
          <DialogDescription>{log.description ?? '—'}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <dt className="text-gray-500">Organization</dt>
              <dd>{log.organization?.name ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">User</dt>
              <dd>{log.user ? `${log.user.first_name} ${log.user.last_name}` : 'System'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">IP Address</dt>
              <dd>{log.ip_address ?? '—'}</dd>
            </div>
            <div className="truncate">
              <dt className="text-gray-500">URL</dt>
              <dd className="truncate" title={log.url ?? undefined}>{log.url ?? '—'}</dd>
            </div>
          </dl>

          {keys.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Changes</h4>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-1 pr-2">Field</th>
                    <th className="py-1 pr-2">Before</th>
                    <th className="py-1">After</th>
                  </tr>
                </thead>
                <tbody>
                  {keys.map((key) => (
                    <tr key={key} className="border-t">
                      <td className="py-1 pr-2 font-medium">{key}</td>
                      <td className="py-1 pr-2 text-red-600 dark:text-red-400 break-all">
                        {display((log.old_values ?? {})[key])}
                      </td>
                      <td className="py-1 text-green-600 dark:text-green-400 break-all">
                        {display((log.new_values ?? {})[key])}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
