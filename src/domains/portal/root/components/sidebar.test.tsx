import { describe, expect, it } from 'vitest';
import { getVisibleNavItems } from './sidebar';

describe('platform sidebar permissions', () => {
  it('only shows modules for which the platform admin has view permission', () => {
    const items = getVisibleNavItems({
      user_type: 'platform_admin',
      permissions: ['view-platform-admins', 'view-organizations'],
    });

    expect(items.map((item) => item.title)).toEqual(['Organizations', 'Platform Admins']);
  });
});
