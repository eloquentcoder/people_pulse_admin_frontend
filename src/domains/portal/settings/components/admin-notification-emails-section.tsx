import { useEffect, useState } from 'react';
import { BellRing, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Label } from '@/common/components/ui/label';
import { Textarea } from '@/common/components/ui/textarea';
import {
  useGetAdminNotificationEmailsQuery,
  useUpdateAdminNotificationEmailsMutation,
} from '../apis/settings.api';

const parseEmails = (value: string): string[] => value
  .split(/[\n,]/)
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const AdminNotificationEmailsSection = () => {
  const { data, isLoading } = useGetAdminNotificationEmailsQuery();
  const [updateEmails, { isLoading: isSaving }] = useUpdateAdminNotificationEmailsMutation();
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(data?.data?.emails?.join('\n') ?? '');
  }, [data]);

  const handleSave = async () => {
    try {
      await updateEmails({ emails: parseEmails(value) }).unwrap();
      toast.success('Admin notification emails saved');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Enter valid, non-duplicate email addresses');
    }
  };

  return (
    <Card className="border-l-4 border-l-violet-500 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BellRing className="h-5 w-5 text-violet-600" />
          Admin notification emails
        </CardTitle>
        <CardDescription>
          These recipients receive platform-wide admin emails, including compliance-review submissions. Active platform admins are notified in-app as well.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-violet-600" aria-label="Loading admin notification emails" /> : <>
          <div className="space-y-2">
            <Label htmlFor="admin-notification-emails">Admin notification emails</Label>
            <Textarea
              id="admin-notification-emails"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={'compliance@example.com\naudit@example.com'}
              disabled={isSaving}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">Enter one email address per line or separate addresses with commas.</p>
          </div>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save notification emails
          </Button>
        </>}
      </CardContent>
    </Card>
  );
};
