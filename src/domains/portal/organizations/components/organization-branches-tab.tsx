import { useState, useMemo } from 'react';
import { Branch } from '../models/organization.model';
import { Input } from '@/common/components/ui/input';
import { Badge } from '@/common/components/ui/badge';
import {
  Search,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Building
} from 'lucide-react';

interface OrganizationBranchesTabProps {
  branches: Branch[];
}

export const OrganizationBranchesTab = ({ branches }: OrganizationBranchesTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBranches = useMemo(() => {
    if (!searchTerm) return branches;
    const search = searchTerm.toLowerCase();
    return branches.filter(branch =>
      branch.name.toLowerCase().includes(search) ||
      branch.code?.toLowerCase().includes(search) ||
      branch.city?.toLowerCase().includes(search) ||
      branch.country?.toLowerCase().includes(search)
    );
  }, [branches, searchTerm]);

  const getAddress = (branch: Branch) => {
    const parts = [branch.city, branch.state, branch.country].filter(Boolean);
    return parts.join(', ') || 'No address';
  };

  if (!branches || branches.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No branches found for this organization</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search branches by name, code, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Branches Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Branch
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Contact
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
            {filteredBranches.map((branch) => (
              <tr key={branch.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                      <Building className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {branch.name}
                        </p>
                        {branch.is_headquarters && (
                          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs">
                            HQ
                          </Badge>
                        )}
                      </div>
                      {branch.code && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Code: {branch.code}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate max-w-[200px]">{getAddress(branch)}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    {branch.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="w-3 h-3" />
                        {branch.phone}
                      </div>
                    )}
                    {branch.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="w-3 h-3" />
                        {branch.email}
                      </div>
                    )}
                    {!branch.phone && !branch.email && (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    {branch.employees_count || 0}
                  </div>
                </td>
                <td className="px-4 py-4">
                  {branch.is_active ? (
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
        Showing {filteredBranches.length} of {branches.length} branches
      </p>
    </div>
  );
};
