import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { toPng } from 'html-to-image';
import {
  AmamantaEvent,
  getEventPlatformLabel,
} from '../../../../core/models/amamanta-event';
import { buildGoogleCalendarUrl } from '../../../../core/models/event-calendar';
import { EventsService } from '../../../../core/services/events.service';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { ErrorModalComponent } from '../../../../shared/components/status-modals/error-modal/error-modal.component';
import { SuccessModalComponent } from '../../../../shared/components/status-modals/success-modal/success-modal.component';
import { LoadingService } from '../../../../shared/services/loading.service';

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: AmamantaEvent[];
}
type MobileCalendarView = 'month' | 'week';

interface CalendarWeek {
  days: CalendarDay[];
}

@Component({
  selector: 'app-events',
  imports: [DatePipe, NgClass, ErrorModalComponent, SuccessModalComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent implements OnInit {
  @ViewChild('calendarImage') calendarImage!: ElementRef<HTMLElement>;
  @ViewChild('selectedEvents') selectedEvents!: ElementRef<HTMLElement>;
  @ViewChild('exportLogo') exportLogo!: ElementRef<HTMLImageElement>;

  today = new Date();

  currentDate = new Date(this.today.getFullYear(), this.today.getMonth(), 1);

  selectedDate = new Date(this.today);
  exporting = false;

  showSuccessModal = false;

  showErrorModal = false;
  errorTitle = '';
  errorMessage = '';

  mobileCalendarView: MobileCalendarView = 'month';

  weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  events: AmamantaEvent[] = [];

  constructor(
    private readonly eventsService: EventsService,
    private readonly router: Router,
    private readonly loadingService: LoadingService,
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  /*
   * Añadir la actividad a Google Calendar, con todo relleno.
   *
   * Solo se ofrece Google Calendar. El calendario de Apple necesita un fichero
   * .ics, y con la aplicación instalada en el iPhone iOS no deja abrirlo: no
   * ocurre nada y no hay forma de avisar a quien lo intenta. Antes que dejar un
   * botón que a veces no hace nada, se ofrece solo lo que funciona siempre.
   */
  addToGoogleCalendar(event: AmamantaEvent): void {
    const url = buildGoogleCalendarUrl(event);

    if (!url) {
      this.showError(
        'No se ha podido abrir el calendario',
        'Esta actividad no tiene una fecha válida. Avísanos y lo revisamos.',
      );

      return;
    }

    window.open(url, '_blank', 'noopener');
  }

  goToWorkshop(workshopId: string): void {
    this.router.navigate(['/talleres'], {
      queryParams: {
        workshopId,
      },
    });
  }

  goToMap(): void {
    this.router.navigate(['/mapa-talleres']);
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }

  get currentMonthName(): string {
    return this.currentDate
      .toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric',
      })
      .toUpperCase();
  }

  get calendarDays(): CalendarDay[] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const firstWeekDay = this.convertSundayBasedDay(firstDayOfMonth.getDay());
    const daysInMonth = lastDayOfMonth.getDate();

    const days: CalendarDay[] = [];

    for (let i = firstWeekDay - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push(this.createCalendarDay(date, false));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push(this.createCalendarDay(date, true));
    }

    while (days.length % 7 !== 0) {
      const lastDate = days[days.length - 1].date;
      const nextDate = new Date(
        lastDate.getFullYear(),
        lastDate.getMonth(),
        lastDate.getDate() + 1,
      );

      days.push(this.createCalendarDay(nextDate, false));
    }

    return days;
  }

  get selectedDateEvents(): AmamantaEvent[] {
    return this.events.filter((event) =>
      this.isSameDate(this.parseLocalDate(event.date), this.selectedDate),
    );
  }

  get monthEvents(): AmamantaEvent[] {
    return this.events
      .filter((event) => {
        const eventDate = this.parseLocalDate(event.date);

        return (
          eventDate.getFullYear() === this.currentDate.getFullYear() &&
          eventDate.getMonth() === this.currentDate.getMonth()
        );
      })
      .sort((a, b) =>
        `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`),
      );
  }

  get calendarWeeks(): CalendarWeek[] {
    const weeks: CalendarWeek[] = [];

    for (let i = 0; i < this.calendarDays.length; i += 7) {
      weeks.push({
        days: this.calendarDays.slice(i, i + 7),
      });
    }

    return weeks;
  }

  get selectedWeek(): CalendarDay[] {
    const selectedTime = this.selectedDate.getTime();

    const week = this.calendarWeeks.find((calendarWeek) =>
      calendarWeek.days.some((day) => day.date.getTime() === selectedTime),
    );

    return week?.days ?? this.calendarWeeks[0]?.days ?? [];
  }

  get selectedWeekEvents(): AmamantaEvent[] {
    return this.selectedWeek
      .flatMap((day) => day.events)
      .sort((a, b) =>
        `${a.date} ${a.startTime || ''}`.localeCompare(
          `${b.date} ${b.startTime || ''}`,
        ),
      );
  }
  /*
   * Texto con el que se identifica dónde ocurre el evento: el lugar si es
   * presencial, y la plataforma si es online.
   */
  getEventPlace(event: AmamantaEvent): string {
    return event.mode === 'online'
      ? `Online · ${getEventPlatformLabel(event.onlinePlatform)}`
      : event.location;
  }

  getEventLocality(event: AmamantaEvent): string {
    if (event.mode === 'online') return 'Online';

    const location = event.location;

    if (location.includes('L’Eliana')) return 'L’Eliana';
    if (location.includes('La Fe')) return 'València';
    if (location.includes('Mislata')) return 'Mislata';
    if (location.includes('Picanya')) return 'Picanya';
    if (location.includes('Vilamarxant')) return 'Vilamarxant';
    if (location.includes('Torrent')) return 'Torrent';
    if (location.includes('Quart de Poblet')) return 'Quart';
    if (location.includes('Valterna')) return 'Valterna';

    return location;
  }

  setMobileCalendarView(view: MobileCalendarView): void {
    this.mobileCalendarView = view;

    if (view === 'week') {
      this.currentDate = new Date(
        this.selectedDate.getFullYear(),
        this.selectedDate.getMonth(),
        1,
      );
    }
  }

  previousWeek(): void {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.selectedDate.getDate() - 7,
    );

    this.currentDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      1,
    );
  }

  nextWeek(): void {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.selectedDate.getDate() + 7,
    );

    this.currentDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      1,
    );
  }

  previousMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1,
    );

    this.selectedDate = new Date(this.currentDate);
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1,
    );

    this.selectedDate = new Date(this.currentDate);
  }

  goToToday(): void {
    const today = new Date();

    this.currentDate = new Date(today.getFullYear(), today.getMonth(), 1);

    this.selectedDate = today;
  }

  selectDay(day: CalendarDay): void {
    this.selectedDate = day.date;

    if (!day.isCurrentMonth) {
      this.currentDate = new Date(
        day.date.getFullYear(),
        day.date.getMonth(),
        1,
      );
    }

    setTimeout(() => {
      this.selectedEvents.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }

  async downloadCalendarImage(): Promise<void> {
    if (!this.calendarImage?.nativeElement) {
      console.error('No se ha encontrado el calendario exportable');

      this.showError(
        'No se ha podido guardar el calendario',
        'El calendario no está disponible en este momento. Recarga la página e inténtalo de nuevo.',
      );

      return;
    }

    if (this.exporting) {
      return;
    }

    this.loadingService.show();
    this.exporting = true;

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });

    const logo = this.exportLogo?.nativeElement;

    if (logo && !logo.complete) {
      await new Promise<void>((resolve) => {
        logo.onload = () => resolve();
        logo.onerror = () => resolve();
      });
    }

    if (logo?.decode) {
      try {
        await logo.decode();
      } catch {}
    }

    try {
      const dataUrl = await toPng(this.calendarImage.nativeElement, {
        cacheBust: true,
        pixelRatio: 2,
        skipFonts: true,
        backgroundColor: '#ffffff',
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();

      const fileName = `calendario-amamanta-${this.currentMonthName
        .replaceAll(' ', '-')
        .toLowerCase()}.png`;

      const file = new File([blob], fileName, {
        type: 'image/png',
      });

      const canShareFile =
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({
          files: [file],
        });

      if (canShareFile) {
        await navigator.share({
          files: [file],
          title: 'Calendario de actividades de Amamanta',
          text: `Calendario de actividades de ${this.currentMonthName.toLowerCase()}.`,
        });

        return;
      }

      this.downloadBlob(blob, fileName);
      this.showSuccessModal = true;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      console.error('Error al guardar el calendario:', error);

      this.showError(
        'No se ha podido guardar el calendario',
        'Ha ocurrido un error al generar la imagen. Inténtalo de nuevo.',
      );
    } finally {
      this.exporting = false;
      this.loadingService.hide();
    }
  }

  private downloadBlob(blob: Blob, fileName: string): void {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = objectUrl;
    link.download = fileName;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 1000);
  }

  formatEventDate(date: string): string {
    return this.parseLocalDate(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
    });
  }

  private loadEvents(): void {
    this.loadingService.show();

    this.eventsService.loadEvents().subscribe({
      next: () => {
        this.events = this.eventsService.getEvents();
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error al cargar las actividades:', error);

        this.loadingService.hide();

        this.showError(
          'No se han podido cargar las actividades',
          'Ha ocurrido un error al obtener la programación. Inténtalo de nuevo más tarde.',
        );
      },
    });
  }
  private showError(title: string, message: string): void {
    this.errorTitle = title;
    this.errorMessage = message;
    this.showErrorModal = true;
  }

  private createCalendarDay(date: Date, isCurrentMonth: boolean): CalendarDay {
    return {
      date,
      dayNumber: date.getDate(),
      isCurrentMonth,
      isToday: this.isSameDate(date, this.today),
      isSelected: this.isSameDate(date, this.selectedDate),
      events: this.getEventsForDate(date),
    };
  }

  private getEventsForDate(date: Date): AmamantaEvent[] {
    return this.events.filter((event) =>
      this.isSameDate(this.parseLocalDate(event.date), date),
    );
  }

  private parseLocalDate(date: string): Date {
    const [year, month, day] = date.split('-').map(Number);

    return new Date(year, month - 1, day);
  }

  private isSameDate(dateA: Date, dateB: Date): boolean {
    return (
      dateA.getFullYear() === dateB.getFullYear() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getDate() === dateB.getDate()
    );
  }

  private convertSundayBasedDay(day: number): number {
    return day === 0 ? 6 : day - 1;
  }
}
