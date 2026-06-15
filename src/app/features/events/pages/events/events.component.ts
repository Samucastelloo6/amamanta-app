import { Component, ElementRef, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import { AmamantaEvent } from '../../../../core/models/amamanta-event';
import { EventsService } from '../../../../core/services/events.service';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: AmamantaEvent[];
}


@Component({
  selector: 'app-events',
  imports: [RouterLink, DatePipe],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {



  @ViewChild('calendarImage') calendarImage!: ElementRef<HTMLElement>;
  @ViewChild('selectedEvents') selectedEvents!: ElementRef<HTMLElement>;

  currentDate = new Date(2026, 5, 1);
  selectedDate = new Date(2026, 5, 2);
  exporting = false;

  weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  events: AmamantaEvent[] = [];

 constructor(
  private readonly eventsService: EventsService,
  private readonly router: Router
) {
  this.events = this.eventsService.getEvents();
}

goToWorkshop(workshopId: string): void {
  this.router.navigate(['/talleres'], {
    queryParams: {
      workshopId
    }
  });
}

goToMap(): void {
  this.router.navigate(['/mapa-talleres']);
}

  get currentMonthName(): string {
    return this.currentDate.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric'
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
        lastDate.getDate() + 1
      );

      days.push(this.createCalendarDay(nextDate, false));
    }

    return days;
  }

  get selectedDateEvents(): AmamantaEvent[] {
    return this.events.filter(event =>
      this.isSameDate(this.parseLocalDate(event.date), this.selectedDate)
    );
  }

  get monthEvents(): AmamantaEvent[] {
    return this.events
      .filter(event => {
        const eventDate = this.parseLocalDate(event.date);

        return eventDate.getFullYear() === this.currentDate.getFullYear() &&
          eventDate.getMonth() === this.currentDate.getMonth();
      })
      .sort((a, b) =>
        `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)
      );
  }

  previousMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );

    this.selectedDate = new Date(this.currentDate);
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );

    this.selectedDate = new Date(this.currentDate);
  }

  goToToday(): void {
    const today = new Date();

    this.currentDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    this.selectedDate = today;
  }

  selectDay(day: CalendarDay): void {
  this.selectedDate = day.date;

  if (!day.isCurrentMonth) {
    this.currentDate = new Date(
      day.date.getFullYear(),
      day.date.getMonth(),
      1
    );
  }

  setTimeout(() => {
    this.selectedEvents.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
}

async downloadCalendarImage(): Promise<void> {

  this.exporting = true;

  await new Promise(resolve => setTimeout(resolve, 50));

  const canvas = await html2canvas(this.calendarImage.nativeElement, {
    backgroundColor: '#fff7ed',
    scale: 2
  });

  this.exporting = false;

  const link = document.createElement('a');

  link.download = `calendario-amamanta-${this.currentMonthName.replaceAll(' ', '-')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

  formatEventDate(date: string): string {
    return this.parseLocalDate(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long'
    });
  }

  private createCalendarDay(date: Date, isCurrentMonth: boolean): CalendarDay {
    return {
      date,
      dayNumber: date.getDate(),
      isCurrentMonth,
      isToday: this.isSameDate(date, new Date()),
      isSelected: this.isSameDate(date, this.selectedDate),
      events: this.getEventsForDate(date)
    };
  }

  private getEventsForDate(date: Date): AmamantaEvent[] {
    return this.events.filter(event =>
      this.isSameDate(this.parseLocalDate(event.date), date)
    );
  }

  private parseLocalDate(date: string): Date {
    const [year, month, day] = date.split('-').map(Number);

    return new Date(year, month - 1, day);
  }

  private isSameDate(dateA: Date, dateB: Date): boolean {
    return dateA.getFullYear() === dateB.getFullYear() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getDate() === dateB.getDate();
  }

  private convertSundayBasedDay(day: number): number {
    return day === 0 ? 6 : day - 1;
  }
}
