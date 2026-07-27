import type { AnalyticsSection } from './analytics.model.js';

export interface RegisterPageViewDto {
  section: AnalyticsSection;
}

export interface AnalyticsPeriodSummary {
  visits: number;
  pageViews: number;
}

export interface AnalyticsSectionSummary {
  section: AnalyticsSection;
  visits: number;
  percentage: number;
}

export interface AnalyticsDailySummary {
  date: string;
  visits: number;
  pageViews: number;
}

export interface AnalyticsMonthlySummary {
  month: string;
  visits: number;
  pageViews: number;
}

export interface AnalyticsSummaryResponse {
  today: AnalyticsPeriodSummary;
  currentMonth: AnalyticsPeriodSummary;
  currentYear: AnalyticsPeriodSummary;

  dailyHistory: AnalyticsDailySummary[];
  monthlyHistory: AnalyticsMonthlySummary[];

  sectionRanking: AnalyticsSectionSummary[];
}
export interface AnalyticsSummaryQuery {
  year: number;
  month?: number;
}
