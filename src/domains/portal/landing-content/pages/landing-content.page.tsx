import { useState } from 'react';
import {
  Layout,
  Type,
  Shield,
  Star,
  BarChart3,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs';
import { useGetLandingContentQuery } from '../apis/landing-content.api';
import { HeroSectionForm } from '../components/hero-section-form';
import { TrustSectionForm } from '../components/trust-section-form';
import { FeaturesSectionForm } from '../components/features-section-form';
import { TestimonialsSectionForm } from '../components/testimonials-section-form';
import { MetricsSectionForm } from '../components/metrics-section-form';

const LandingContentPage = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const { data, isLoading, refetch } = useGetLandingContentQuery();

  const tabs = [
    { id: 'hero', label: 'Hero', icon: Layout, description: 'Main headline and call-to-action' },
    { id: 'trust', label: 'Trust & Logos', icon: Shield, description: 'Company logos and trust badges' },
    { id: 'features', label: 'Features', icon: Star, description: 'Core product features' },
    { id: 'testimonials', label: 'Testimonials', icon: Type, description: 'Customer testimonials' },
    { id: 'metrics', label: 'Metrics', icon: BarChart3, description: 'Key statistics and metrics' },
  ];

  const content = data?.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Landing Page Content</h1>
          <p className="text-gray-600">Manage the content displayed on the public landing page</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Content Sections</CardTitle>
          <CardDescription>
            Edit each section of your landing page. Changes are saved immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b px-6">
                <TabsList className="bg-transparent h-auto gap-4 p-0">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex items-center gap-2 py-3 px-1 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none rounded-none bg-transparent"
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="hero" className="mt-0">
                  <HeroSectionForm
                    data={content?.sections?.hero?.content}
                  />
                </TabsContent>
                <TabsContent value="trust" className="mt-0">
                  <TrustSectionForm
                    data={content?.sections?.trust?.content}
                    companies={content?.trusted_companies || []}
                  />
                </TabsContent>
                <TabsContent value="features" className="mt-0">
                  <FeaturesSectionForm
                    data={content?.sections?.features?.content}
                  />
                </TabsContent>
                <TabsContent value="testimonials" className="mt-0">
                  <TestimonialsSectionForm
                    data={content?.sections?.testimonials?.content}
                  />
                </TabsContent>
                <TabsContent value="metrics" className="mt-0">
                  <MetricsSectionForm
                    data={content?.sections?.metrics?.content}
                  />
                </TabsContent>
              </div>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingContentPage;
