export type AnalyticsSection =
  | 'home'
  | 'events'
  | 'workshops'
  | 'universityRooms'
  | 'hospitals'
  | 'friendlySpaces'
  | 'contact'
  | 'collaborate'
  | 'feedback';

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

export interface AnalyticsSummary {
  today: AnalyticsPeriodSummary;
  currentMonth: AnalyticsPeriodSummary;
  currentYear: AnalyticsPeriodSummary;

  /* Primer día contado con visitantes únicos, en formato aaaa-mm-dd. */
  reliableFrom?: string;

  dailyHistory: AnalyticsDailySummary[];
  monthlyHistory: AnalyticsMonthlySummary[];

  sectionRanking: AnalyticsSectionSummary[];
}
