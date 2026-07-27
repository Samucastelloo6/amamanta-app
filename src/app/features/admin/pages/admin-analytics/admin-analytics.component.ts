import { DecimalPipe } from '@angular/common';
import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import {
  AnalyticsSection,
  AnalyticsSummary,
} from '../../../../core/analytics/analytics.models';
import { AnalyticsService } from '../../../../core/analytics/analytics.service';
import { ErrorModalComponent } from '../../../../shared/components/status-modals/error-modal/error-modal.component';

@Component({
  selector: 'app-admin-analytics',
  imports: [DecimalPipe, ErrorModalComponent],
  templateUrl: './admin-analytics.component.html',
  styleUrl: './admin-analytics.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminAnalyticsComponent implements OnInit {
  private readonly analyticsService = inject(AnalyticsService);

  readonly currentAnalytics = signal<AnalyticsSummary | null>(null);

  readonly historicalAnalytics = signal<AnalyticsSummary | null>(null);
  readonly isLoading = signal(true);

  readonly selectedYear = signal(new Date().getFullYear());
  readonly selectedMonth = signal(new Date().getMonth() + 1);

  readonly years = Array.from(
    { length: 10 },
    (_, index) => new Date().getFullYear() - index,
  );

  readonly months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  readonly showErrorModal = signal(false);
  readonly errorTitle = signal('');
  readonly errorMessage = signal('');

  readonly maxDailyVisits = computed(() => {
    const visits =
      this.historicalAnalytics()?.dailyHistory.map((item) => item.visits) ?? [];

    return Math.max(...visits, 1);
  });

  readonly maxMonthlyVisits = computed(() => {
    const visits =
      this.historicalAnalytics()?.monthlyHistory.map((item) => item.visits) ??
      [];

    return Math.max(...visits, 1);
  });

  readonly mostVisitedSection = computed(() => {
    return this.historicalAnalytics()?.sectionRanking[0] ?? null;
  });

  ngOnInit(): void {
    this.loadCurrentAnalytics();
    this.loadHistoricalAnalytics();
  }

  changeYear(event: Event): void {
    const year = Number((event.target as HTMLSelectElement).value);

    this.selectedYear.set(year);
    this.loadHistoricalAnalytics();
  }

  changeMonth(event: Event): void {
    const month = Number((event.target as HTMLSelectElement).value);

    this.selectedMonth.set(month);
    this.loadHistoricalAnalytics();
  }

  getSelectedMonthLabel(): string {
    return (
      this.months.find((month) => month.value === this.selectedMonth())
        ?.label ?? ''
    );
  }

  getSectionLabel(section: AnalyticsSection): string {
    switch (section) {
      case 'home':
        return 'Inicio';

      case 'events':
        return 'Actividades';

      case 'workshops':
        return 'Talleres LM';

      case 'universityRooms':
        return 'Salas lactancia UV';

      case 'hospitals':
        return 'Voluntariado hospitalario';

      case 'friendlySpaces':
        return 'Espacios amigos LM';

      case 'contact':
        return 'Contacto';

      case 'collaborate':
        return 'Colabora';

      case 'feedback':
        return 'Valora la aplicación';
    }
  }

  getSectionIcon(section: AnalyticsSection): string {
    switch (section) {
      case 'home':
        return 'solar:home-2-bold';

      case 'events':
        return 'solar:calendar-bold';

      case 'workshops':
        return 'solar:users-group-rounded-bold';

      case 'universityRooms':
        return 'solar:buildings-2-bold';

      case 'hospitals':
        return 'solar:hospital-bold';

      case 'friendlySpaces':
        return 'solar:shop-2-bold';

      case 'contact':
        return 'solar:phone-calling-bold';

      case 'collaborate':
        return 'solar:heart-hand-bold';

      case 'feedback':
        return 'solar:star-bold';
    }
  }

  getRankingIcon(index: number): string {
    switch (index) {
      case 0:
        return 'solar:cup-star-bold';

      case 1:
        return 'solar:medal-ribbons-star-bold';

      case 2:
        return 'solar:medal-star-bold';

      default:
        return 'solar:hashtag-square-bold';
    }
  }

  getDayLabel(date: string): string {
    return date.slice(8, 10);
  }

  getMonthLabel(month: string): string {
    const monthNumber = Number(month.slice(5, 7));

    const labels = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];

    return labels[monthNumber - 1] ?? month;
  }

  getDailyBarHeight(visits: number): number {
    if (visits === 0) {
      return 0;
    }

    return Math.max((visits / this.maxDailyVisits()) * 100, 6);
  }

  getMonthlyBarHeight(visits: number): number {
    if (visits === 0) {
      return 0;
    }

    return Math.max((visits / this.maxMonthlyVisits()) * 100, 6);
  }

  closeErrorModal(): void {
    this.showErrorModal.set(false);
  }

  private showError(title: string, message: string): void {
    this.errorTitle.set(title);
    this.errorMessage.set(message);
    this.showErrorModal.set(true);
  }

  private loadCurrentAnalytics(): void {
    this.isLoading.set(true);

    this.analyticsService.getCurrentSummary().subscribe({
      next: (response) => {
        this.currentAnalytics.set(response.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);

        this.showError(
          'No se ha podido cargar la analítica',
          'Ha ocurrido un error al obtener las estadísticas de uso. Inténtalo de nuevo más tarde.',
        );
      },
    });
  }

  private loadHistoricalAnalytics(): void {
    this.analyticsService
      .getHistoricalSummary(this.selectedYear(), this.selectedMonth())
      .subscribe({
        next: (response) => {
          this.historicalAnalytics.set(response.data);
        },
        error: () => {
          this.showError(
            'No se ha podido cargar la analítica',
            'Ha ocurrido un error al obtener las estadísticas de uso. Inténtalo de nuevo más tarde.',
          );
        },
      });
  }
}
