import { useState, useMemo } from 'react';
import { Department } from '../models/organization.model';
import { Input } from '@/common/components/ui/input';
import { Badge } from '@/common/components/ui/badge';
import {
  Search,
  Building2,
  Users,
  CheckCircle,
  XCircle,
  ChevronRight
} from 'lucide-react';

interface OrganizationDepartmentsTabProps {
  departments: Department[];
}

export const OrganizationDepartmentsTab = ({ departments }: OrganizationDepartmentsTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDepartments = useMemo(() => {
    if (!searchTerm) return departments;
    const search = searchTerm.toLowerCase();
    return departments.filter(dept =>
      dept.name.toLowerCase().includes(search) ||
      dept.code?.toLowerCase().includes(search) ||
      dept.description?.toLowerCase().includes(search)
    );
  }, [departments, searchTerm]);

  const getManagerName = (dept: Department) => {
    if (!dept.manager?.user) return 'Not assigned';
    return `${dept.manager.user.first_name} ${dept.manager.user.last_name}`;
  };

  if (!departments || departments.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No departments found for this organization</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search departments by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Departments Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Department
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Manager
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
            {filteredDepartments.map((dept) => (
              <tr key={dept.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {dept.name}
                      </p>
                      {dept.parent && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <ChevronRight className="w-3 h-3" />
                          {dept.parent.name}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-600 dark:text-gray-400">
                  {dept.code || '-'}
                </td>
                <td className="px-4 py-4 text-gray-600 dark:text-gray-400">
                  {getManagerName(dept)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    {dept.employees_count || 0}
                  </div>
                </td>
                <td className="px-4 py-4">
                  {dept.is_active ? (
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
        Showing {filteredDepartments.length} of {departments.length} departments
      </p>
    </div>
  );
};
