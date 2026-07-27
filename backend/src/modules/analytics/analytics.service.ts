import { AnalyticsModel } from './analytics.model.js';
import type {
  AnalyticsSection,
  AnalyticsSectionsDocument,
} from './analytics.model.js';
import {
  mapAnalyticsToDailySummary,
  mapSectionsToRanking,
} from './analytics.mapper.js';
import type {
  AnalyticsMonthlySummary,
  AnalyticsPeriodSummary,
  AnalyticsSummaryQuery,
  AnalyticsSummaryResponse,
  RegisterPageViewDto,
} from './analytics.types.js';

const timeZone = 'Europe/Madrid';

export async function registerVisit() {
  const date = getCurrentDate();

  return AnalyticsModel.findOneAndUpdate(
    {
      date,
    },
    {
      $inc: {
        visits: 1,
      },
    },
    {
      upsert: true,
      returnDocument: 'after',
      setDefaultsOnInsert: true,
      runValidators: true,
    },
  ).exec();
}

export async function registerPageView(data: RegisterPageViewDto) {
  const date = getCurrentDate();
  const sectionField = `sections.${data.section}`;

  return AnalyticsModel.findOneAndUpdate(
    {
      date,
    },
    {
      $inc: {
        pageViews: 1,
        [sectionField]: 1,
      },
    },
    {
      upsert: true,
      returnDocument: 'after',
      setDefaultsOnInsert: true,
      runValidators: true,
    },
  ).exec();
}

export async function getAnalyticsSummary(
  query: AnalyticsSummaryQuery,
): Promise<AnalyticsSummaryResponse> {
  const currentDate = getCurrentDate();

  const currentYear = Number(currentDate.slice(0, 4));
  const currentMonth = Number(currentDate.slice(5, 7));

  const selectedYear = query.year;
  const selectedMonth = query.month ?? currentMonth;

  const monthStart = formatDate(selectedYear, selectedMonth, 1);
  const monthEnd = getNextMonthStart(selectedYear, selectedMonth);

  const yearStart = `${selectedYear}-01-01`;
  const nextYearStart = `${selectedYear + 1}-01-01`;

  const isCurrentMonth =
    selectedYear === currentYear && selectedMonth === currentMonth;

  const [todayDocument, monthDocuments, yearDocuments] = await Promise.all([
    isCurrentMonth
      ? AnalyticsModel.findOne({
          date: currentDate,
        })
          .lean()
          .exec()
      : Promise.resolve(null),

    AnalyticsModel.find({
      date: {
        $gte: monthStart,
        $lt: monthEnd,
      },
    })
      .sort({
        date: 1,
      })
      .lean()
      .exec(),

    AnalyticsModel.find({
      date: {
        $gte: yearStart,
        $lt: nextYearStart,
      },
    })
      .sort({
        date: 1,
      })
      .lean()
      .exec(),
  ]);

  const today: AnalyticsPeriodSummary = {
    visits: todayDocument?.visits ?? 0,
    pageViews: todayDocument?.pageViews ?? 0,
  };

  const selectedMonthSummary = sumPeriod(monthDocuments);
  const selectedYearSummary = sumPeriod(yearDocuments);

  const selectedMonthSections = sumSections(monthDocuments);

  return {
    today,

    currentMonth: selectedMonthSummary,

    currentYear: selectedYearSummary,

    dailyHistory: monthDocuments.map(mapAnalyticsToDailySummary),

    monthlyHistory: buildMonthlyHistory(yearDocuments, selectedYear),

    sectionRanking: mapSectionsToRanking(selectedMonthSections),
  };
}

function sumPeriod(
  documents: Array<{
    visits: number;
    pageViews: number;
  }>,
): AnalyticsPeriodSummary {
  return documents.reduce<AnalyticsPeriodSummary>(
    (summary, document) => ({
      visits: summary.visits + document.visits,
      pageViews: summary.pageViews + document.pageViews,
    }),
    {
      visits: 0,
      pageViews: 0,
    },
  );
}

function sumSections(
  documents: Array<{
    sections: AnalyticsSectionsDocument;
  }>,
): AnalyticsSectionsDocument {
  const totals = getEmptySections();

  for (const document of documents) {
    for (const section of Object.keys(totals) as AnalyticsSection[]) {
      totals[section] += document.sections?.[section] ?? 0;
    }
  }

  return totals;
}

function buildMonthlyHistory(
  documents: Array<{
    date: string;
    visits: number;
    pageViews: number;
  }>,
  year: number,
): AnalyticsMonthlySummary[] {
  const months = Array.from(
    {
      length: 12,
    },
    (_, index) => ({
      month: `${year}-${String(index + 1).padStart(2, '0')}`,
      visits: 0,
      pageViews: 0,
    }),
  );

  for (const document of documents) {
    const monthIndex = Number(document.date.slice(5, 7)) - 1;
    const month = months[monthIndex];

    if (!month) {
      continue;
    }

    month.visits += document.visits;
    month.pageViews += document.pageViews;
  }

  return months;
}

function getEmptySections(): AnalyticsSectionsDocument {
  return {
    home: 0,
    events: 0,
    workshops: 0,
    universityRooms: 0,
    hospitals: 0,
    friendlySpaces: 0,
    contact: 0,
    collaborate: 0,
    feedback: 0,
  };
}

function getCurrentDate(): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    throw new Error('No se ha podido calcular la fecha de analítica');
  }

  return `${year}-${month}-${day}`;
}

function formatDate(year: number, month: number, day: number): string {
  return [
    year,
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0'),
  ].join('-');
}

function getNextMonthStart(year: number, month: number): string {
  if (month === 12) {
    return `${year + 1}-01-01`;
  }

  return formatDate(year, month + 1, 1);
}
