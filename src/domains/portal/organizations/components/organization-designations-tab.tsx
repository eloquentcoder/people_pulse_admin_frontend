import { useState, useMemo } from 'react';
import { Position } from '../models/organization.model';
import { Input } from '@/common/components/ui/input';
import { Badge } from '@/common/components/ui/badge';
import {
  Search,
  Briefcase,
  Users,
  CheckCircle,
  XCircle,
  TrendingUp
} from 'lucide-react';

interface OrganizationDesignationsTabProps {
  positions: Position[];
}

export const OrganizationDesignationsTab = ({ positions }: OrganizationDesignationsTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPositions = useMemo(() => {
    if (!searchTerm) return positions;
    const search = searchTerm.toLowerCase();
    return positions.filter(position =>
      position.title.toLowerCase().includes(search) ||
      position.code?.toLowerCase().includes(search) ||
      position.level?.toLowerCase().includes(search)
    );
  }, [positions, searchTerm]);

  const getLevelBadge = (level?: string) => {
    if (!level) return null;

    const levelColors: Record<string, string> = {
      'entry': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      'junior': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'mid': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      'senior': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'lead': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'manager': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      'director': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'executive': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

    return (
      <Badge className={levelColors[level] || 'bg-gray-100 text-gray-800'}>
        <TrendingUp className="w-3 h-3 mr-1" />
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Badge>
    );
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return '-';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return '-';
  };

  if (!positions || positions.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No designations found for this organization</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search designations by title, code, or level..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Positions Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Designation
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Level
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Salary Range
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Employees
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPositions.map((position) => (
              <tr key={position.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {position.title}
                      </p>
                      {position.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                          {position.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-600 dark:text-gray-400">
                  {position.code || '-'}
                </td>
                <td className="px-4 py-4">
                  {getLevelBadge(position.level) || (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-4 text-gray-600 dark:text-gray-400">
                  {formatSalary(position.min_salary, position.max_salary)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    {position.employees_count || 0}
                  </div>
                </td>
                <td className="px-4 py-4">
                  {position.is_active ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">
                      <XCircle className="w-3 h-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredPositions.length} of {positions.length} designations
      </p>
    </div>
  );
};
