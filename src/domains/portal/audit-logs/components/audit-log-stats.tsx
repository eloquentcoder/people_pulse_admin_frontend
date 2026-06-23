import { Card, CardContent } from '@/common/components/ui/card';
import { Activity, CalendarDays, CalendarRange, Building2 } from 'lucide-react';
import type { AuditLogStats } from '../models/audit-log.model';

interface Props {
  stats?: AuditLogStats;
}

const cards = [
  { key: 'total', label: 'Total Events', icon: Activity, color: '#4469e5' },
  { key: 'today', label: 'Today', icon: CalendarDays, color: '#10b981' },
  { key: 'this_week', label: 'This Week', icon: CalendarRange, color: '#ee9807' },
  { key: 'active_organizations', label: 'Active Orgs', icon: Building2, color: '#8b5cf6' },
] as const;

export const AuditLogStatsCards = ({ stats }: Props) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, color }) => (
        <Card key={key}>
          <CardContent className="flex items-center gap-3 p-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${color}1a` }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {stats ? stats[key].toLocaleString() : '—'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
