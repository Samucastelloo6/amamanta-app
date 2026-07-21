import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Workshop, WorkshopTime } from '../../../../core/models/workshop';

type DayFilter = 'lunes' | 'martes' | 'miércoles' | 'jueves' | 'viernes';

type TimeFilter = 'all' | WorkshopTime;

@Component({
  selector: 'app-workshop-week-calendar',
  imports: [],
  templateUrl: './workshop-week-calendar.component.html',
})
export class WorkshopWeekCalendarComponent {
  @Input({ required: true }) workshops: Workshop[] = [];
  @Input() userPosition: google.maps.LatLngLiteral | null = null;

  @Output() workshopSelected = new EventEmitter<Workshop>();

  selectedTime: TimeFilter = 'all';

  weekDays: { value: DayFilter; label: string }[] = [
    { value: 'lunes', label: 'Lunes' },
    { value: 'martes', label: 'Martes' },
    { value: 'miércoles', label: 'Miércoles' },
    { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' },
  ];

  changeTime(time: TimeFilter): void {
    this.selectedTime = time;
  }

  getWorkshopsByDayAndTime(day: DayFilter, time: WorkshopTime): Workshop[] {
    return this.filteredWorkshops.filter(
      (workshop) => workshop.day === day && workshop.time === time,
    );
  }

  selectWorkshop(workshop: Workshop): void {
    this.workshopSelected.emit(workshop);
  }
  get filteredWorkshops(): Workshop[] {
    return [...this.workshops].sort((a, b) => {
      if (!this.userPosition) {
        return 0;
      }

      return this.getDistance(a) - this.getDistance(b);
    });
  }
  private getDistance(workshop: Workshop): number {
    if (!this.userPosition) {
      return 9999;
    }

    const earthRadius = 6371;

    const dLat = this.toRadians(workshop.latitude - this.userPosition.lat);
    const dLng = this.toRadians(workshop.longitude - this.userPosition.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(this.userPosition.lat)) *
        Math.cos(this.toRadians(workshop.latitude)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
  }
  private toRadians(value: number): number {
    return (value * Math.PI) / 180;
  }
}
