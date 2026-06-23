import { Card, CardContent } from '@/common/components/ui/card';
import { Input } from '@/common/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select';
import { Search } from 'lucide-react';
import { AUDIT_ACTION_TYPES } from '../models/audit-log.model';
import type { AuditLogFilters, AuditLogFilterOptions } from '../models/audit-log.model';

interface Props {
  filters: AuditLogFilters;
  options?: AuditLogFilterOptions;
  onChange: (key: keyof AuditLogFilters, value: string) => void;
}

const ALL = 'all';

export const AuditLogFiltersBar = ({ filters, options, onChange }: Props) => {
  return (
    <Card>
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by user, description, or URL"
            value={filters.search ?? ''}
            onChange={(e) => onChange('search', e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={(filters.organization_id ? String(filters.organization_id) : ALL)}
          onValueChange={(v) => onChange('organization_id', v === ALL ? '' : v)}
        >
          <SelectTrigger aria-label="Organization">
            <SelectValue placeholder="All organizations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All organizations</SelectItem>
            {options?.organizations.map((org) => (
              <SelectItem key={org.id} value={String(org.id)}>
                {org.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={(filters.action_type ? String(filters.action_type) : ALL)}
          onValueChange={(v) => onChange('action_type', v === ALL ? '' : v)}
        >
          <SelectTrigger aria-label="Action type">
            <SelectValue placeholder="All actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All actions</SelectItem>
            {AUDIT_ACTION_TYPES.map((a) => (
              <SelectItem key={a.value} value={a.value}>
                {a.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          aria-label="From date"
          value={filters.date_from ?? ''}
          onChange={(e) => onChange('date_from', e.target.value)}
        />
        <Input
          type="date"
          aria-label="To date"
          value={filters.date_to ?? ''}
          onChange={(e) => onChange('date_to', e.target.value)}
        />
      </CardContent>
    </Card>
  );
};
