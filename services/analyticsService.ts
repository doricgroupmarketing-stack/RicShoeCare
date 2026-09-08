export const analyticsService = {
  /**
   * Track a page view
   */
  async trackPageView(path: string) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'page_view',
          page_path: path
        })
      });
    } catch (e) {
      console.error('Failed to track page view', e);
    }
  },

  /**
   * Track a specific user action (click, conversion, etc.)
   */
  async trackAction(name: string, metadata: any = {}) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'action',
          event_name: name,
          metadata
        })
      });
    } catch (e) {
      console.error('Failed to track action', e);
    }
  },

  /**
   * Get aggregated stats for the dashboard
   */
  async getDashboardStats() {
    try {
      const res = await fetch('/api/analytics/stats');
      if (!res.ok) {
        return { totalViews: 0, socialClicks: 0, scans: 0 };
      }
      const data = await res.json();
      return {
        totalViews: data.totalViews || 0,
        socialClicks: data.socialClicks || 0,
        scans: data.scans || 0
      };
    } catch (e) {
      console.error('Failed to fetch analytics stats', e);
      return { totalViews: 0, socialClicks: 0, scans: 0 };
    }
  }
};
