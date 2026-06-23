import { useState } from 'react';
import { Card } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { RefreshCw, Download, ScrollText } from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetAuditLogsQuery,
  useGetAuditLogStatsQuery,
  useGetAuditLogFilterOptionsQuery,
  useLazyExportAuditLogsQuery,
} from '../apis/audit-logs.api';
import type { AuditLogEntry, AuditLogFilters } from '../models/audit-log.model';
import { AuditLogStatsCards } from '../components/audit-log-stats';
import { AuditLogFiltersBar } from '../components/audit-log-filters';
import { AuditLogTable } from '../components/audit-log-table';
import { AuditLogDetailModal } from '../components/audit-log-detail-modal';

const DEFAULT_FILTERS: AuditLogFilters = { per_page: 15, page: 1 };

const AuditLogsPage = () => {
  const [filters, setFilters] = useState<AuditLogFilters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<AuditLogEntry | null>(null);

  const { data: logsData, isLoading, isFetching, refetch } = useGetAuditLogsQuery(filters);
  const { data: statsData } = useGetAuditLogStatsQuery();
  const { data: optionsData } = useGetAuditLogFilterOptionsQuery();
  const [triggerExport, { isLoading: isExporting }] = useLazyExportAuditLogsQuery();

  const logs = logsData?.data?.data ?? [];
  const pagination = logsData?.data;

  const handleFilterChange = (key: keyof AuditLogFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleExport = async () => {
    try {
      const blob = await triggerExport(filters).unwrap();
      if (typeof window !== 'undefined' && window.URL?.createObjectURL) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
      toast.success('Audit logs exported');
    } catch {
      toast.error('Failed to export audit logs');
    }
  };

  return (
    <div className="space-y-5 p-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <ScrollText className="w-6 h-6 text-[#4469e5]" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Audit Log</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Every action taken by organization admins and employees
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`w-4 h-4 mr-1 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={handleExport} disabled={isExporting}>
            <Download className="w-4 h-4 mr-1" />
            Export CSV
          </Button>
        </div>
      </div>

      <AuditLogStatsCards stats={statsData?.data} />

      <AuditLogFiltersBar filters={filters} options={optionsData?.data} onChange={handleFilterChange} />

      <Card className="overflow-hidden py-0">
        <AuditLogTable logs={logs} isLoading={isLoading} onView={setSelected} />

        {pagination && pagination.last_page > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
              {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <AuditLogDetailModal log={selected} open={selected !== null} onClose={() => setSelected(null)} />
    </div>
  );
};

export default AuditLogsPage;
