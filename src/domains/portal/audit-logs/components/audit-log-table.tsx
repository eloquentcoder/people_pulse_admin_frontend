import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/ui/table';
import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { Eye } from 'lucide-react';
import { auditActionColor } from '../models/audit-log.model';
import type { AuditLogEntry } from '../models/audit-log.model';

interface Props {
  logs: AuditLogEntry[];
  isLoading?: boolean;
  onView: (log: AuditLogEntry) => void;
}

const userName = (log: AuditLogEntry): string =>
  log.user ? `${log.user.first_name} ${log.user.last_name}`.trim() : 'System';

const formatWhen = (iso: string): string => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
};

const resourceOf = (log: AuditLogEntry): string => {
  const base = log.event.includes('.') ? log.event.split('.')[0] : log.event;
  return log.auditable_id ? `${base} #${log.auditable_id}` : base;
};

export const AuditLogTable = ({ logs, isLoading, onView }: Props) => {
  if (!isLoading && logs.length === 0) {
    return (
      <div className="p-10 text-center text-sm text-gray-500 dark:text-gray-400">
        No audit log entries match the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>When</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>IP</TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="cursor-pointer" onClick={() => onView(log)}>
              <TableCell className="whitespace-nowrap text-sm">{formatWhen(log.created_at)}</TableCell>
              <TableCell>{log.organization?.name ?? '—'}</TableCell>
              <TableCell>{userName(log)}</TableCell>
              <TableCell>
                <Badge
                  style={{
                    color: auditActionColor(log.action_type),
                    backgroundColor: `${auditActionColor(log.action_type)}1a`,
                  }}
                >
                  {log.event}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{resourceOf(log)}</TableCell>
              <TableCell className="text-sm text-gray-500">{log.ip_address ?? '—'}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="View audit log"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(log);
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
