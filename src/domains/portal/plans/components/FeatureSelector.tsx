import { useState } from 'react';
import { useGetFeaturesQuery } from '@/domains/portal/features/apis/features.api';
import { Label } from '@/common/components/ui/label';
import { Input } from '@/common/components/ui/input';
import { Badge } from '@/common/components/ui/badge';
import { Checkbox } from '@/common/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Search, Check } from 'lucide-react';
import type { Feature } from '@/domains/portal/features/types';

interface FeatureSelectorProps {
  selectedFeatureIds: string[];
  onSelectionChange: (featureIds: string[]) => void;
}

export function FeatureSelector({ selectedFeatureIds, onSelectionChange }: FeatureSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: featuresData, isLoading } = useGetFeaturesQuery({ is_active: true });

  const features = featuresData?.data || [];
  
  // Group features by category
  const groupedFeatures = features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);

  // Filter features by search term
  const filteredGroups = Object.entries(groupedFeatures).reduce((acc, [category, categoryFeatures]) => {
    const filtered = categoryFeatures.filter(feature =>
      feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, Feature[]>);

  const handleFeatureToggle = (featureId: string) => {
    if (selectedFeatureIds.includes(featureId)) {
      onSelectionChange(selectedFeatureIds.filter(id => id !== featureId));
    } else {
      onSelectionChange([...selectedFeatureIds, featureId]);
    }
  };

  const handleSelectAll = (categoryFeatures: Feature[]) => {
    const categoryIds = categoryFeatures.map(f => f.id);
    const allSelected = categoryIds.every(id => selectedFeatureIds.includes(id));
    
    if (allSelected) {
      onSelectionChange(selectedFeatureIds.filter(id => !categoryIds.includes(id)));
    } else {
      const newIds = [...selectedFeatureIds];
      categoryIds.forEach(id => {
        if (!newIds.includes(id)) {
          newIds.push(id);
        }
      });
      onSelectionChange(newIds);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading features...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Features</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <p className="text-xs text-gray-500">
          {selectedFeatureIds.length} feature{selectedFeatureIds.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-4 border rounded-lg p-4">
        {Object.keys(filteredGroups).length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-8">
            No features found
          </div>
        ) : (
          Object.entries(filteredGroups).map(([category, categoryFeatures]) => {
            const categoryIds = categoryFeatures.map(f => f.id);
            const allSelected = categoryIds.every(id => selectedFeatureIds.includes(id));
            const someSelected = categoryIds.some(id => selectedFeatureIds.includes(id));

            return (
              <Card key={category}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </CardTitle>
                    <button
                      type="button"
                      onClick={() => handleSelectAll(categoryFeatures)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      {allSelected ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categoryFeatures.map((feature) => {
                    const isSelected = selectedFeatureIds.includes(feature.id);
                    return (
                      <div
                        key={feature.id}
                        className="flex items-start gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => handleFeatureToggle(feature.id)}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleFeatureToggle(feature.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{feature.name}</span>
                            {feature.icon && (
                              <Badge variant="outline" className="text-xs">
                                {feature.icon}
                              </Badge>
                            )}
                          </div>
                          {feature.description && (
                            <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
