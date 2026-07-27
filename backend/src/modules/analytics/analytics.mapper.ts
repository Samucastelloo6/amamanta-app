import type {
  AnalyticsSection,
  AnalyticsSectionsDocument,
} from './analytics.model.js';
import type {
  AnalyticsDailySummary,
  AnalyticsSectionSummary,
} from './analytics.types.js';

interface AnalyticsDailySource {
  date: string;
  visits: number;
  pageViews: number;
}

export function mapAnalyticsToDailySummary(
  analytics: AnalyticsDailySource,
): AnalyticsDailySummary {
  return {
    date: analytics.date,
    visits: analytics.visits,
    pageViews: analytics.pageViews,
  };
}

export function mapSectionsToRanking(
  sections: AnalyticsSectionsDocument,
): AnalyticsSectionSummary[] {
  const rankingSections = (
    Object.entries(sections) as [AnalyticsSection, number][]
  ).filter(([section]) => section !== 'home');

  const totalPageViews = rankingSections.reduce(
    (total, [, visits]) => total + visits,
    0,
  );

  return rankingSections
    .map(([section, visits]) => ({
      section,
      visits,
      percentage:
        totalPageViews === 0
          ? 0
          : Number(((visits / totalPageViews) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.visits - a.visits);
}
