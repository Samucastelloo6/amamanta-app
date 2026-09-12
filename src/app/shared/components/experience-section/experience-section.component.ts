import { DatePipe, DecimalPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Experience, ExperienceType } from '../../../core/models/experiencies';
import { ExperienceService } from '../../../core/services/experience.service';
import { ErrorModalComponent } from '../status-modals/error-modal/error-modal.component';

export interface WorkshopExperienceGroup {
  key: string;
  name: string;
  experiences: Experience[];
  average: number;
}

const WITHOUT_WORKSHOP_KEY = 'sin-taller';

@Component({
  selector: 'app-experience-section',
  imports: [
    DatePipe,
    DecimalPipe,
    FormsModule,
    NgClass,
    NgTemplateOutlet,
    RouterLink,
    ErrorModalComponent,
  ],
  templateUrl: './experience-section.component.html',
  styleUrl: './experience-section.component.scss',
})
export class ExperienceSectionComponent implements OnInit, OnChanges {
  @Input() type?: ExperienceType;

  private readonly route = inject(ActivatedRoute);
  private readonly experienceService = inject(ExperienceService);

  experiences: Experience[] = [];

  groups: WorkshopExperienceGroup[] = [];

  selectedGroupKey = 'all';

  showErrorModal = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const routeType = params.get('type');

      if (!this.isValidType(routeType)) {
        this.type = undefined;
        this.experiences = [];
        this.groups = [];
        return;
      }

      this.type = routeType;
      this.loadExperiences();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type'] && !changes['type'].firstChange) {
      this.loadExperiences();
    }
  }

  get isGroupedByWorkshop(): boolean {
    return this.type === 'workshops' && this.groups.length > 0;
  }

  get visibleGroups(): WorkshopExperienceGroup[] {
    if (this.selectedGroupKey === 'all') {
      return this.groups;
    }

    return this.groups.filter((group) => group.key === this.selectedGroupKey);
  }

  getTitle(): string {
    switch (this.type) {
      case 'workshops':
        return 'Experiencias en talleres de lactancia materna';

      case 'rooms':
        return 'Experiencias en salas de lactancia de la Universitat de València';

      case 'friendly-spaces':
        return 'Experiencias en Espacios Amigos de la Lactancia Materna';

      case 'hospitals':
        return 'Experiencias con el voluntariado hospitalario';

      default:
        return 'Experiencias';
    }
  }

  getSubtitle(): string {
    switch (this.type) {
      case 'workshops':
        return 'Descubre cómo han vivido otras familias los talleres de lactancia materna de Amamanta y comparte también tu experiencia.';

      case 'rooms':
        return 'Conoce la experiencia de otras familias utilizando las salas de lactancia de la Universitat de València.';

      case 'friendly-spaces':
        return 'Descubre cómo han vivido otras familias su paso por los Espacios Amigos de la Lactancia Materna.';

      case 'hospitals':
        return 'Conoce cómo han vivido otras madres y familias el acompañamiento de las voluntarias de Amamanta durante su estancia hospitalaria.';

      default:
        return '';
    }
  }

  getShareRoute(): string[] {
    return ['/experiencias', this.type ?? 'workshops', 'compartir'];
  }

  getRatingText(rating: number): string {
    switch (rating) {
      case 1:
        return 'Necesita mejorar.';

      case 2:
        return 'Podría mejorar en algunos aspectos.';

      case 3:
        return 'Ha sido una experiencia correcta.';

      case 4:
        return 'Ha sido una experiencia muy positiva.';

      case 5:
        return 'Ha sido una experiencia excelente.';

      default:
        return '';
    }
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }

  private loadExperiences(): void {
    if (!this.type) {
      this.experiences = [];
      this.groups = [];
      return;
    }

    this.experienceService.loadExperiences(this.type).subscribe({
      next: () => {
        this.experiences = this.experienceService.getByType(this.type!);
        this.buildWorkshopGroups();
      },
      error: () => {
        this.experiences = [];
        this.groups = [];
        this.showErrorModal = true;
      },
    });
  }

  private buildWorkshopGroups(): void {
    if (this.type !== 'workshops') {
      this.groups = [];
      this.selectedGroupKey = 'all';
      return;
    }

    const grouped = new Map<string, WorkshopExperienceGroup>();

    for (const experience of this.experiences) {
      const key = experience.workshopId ?? WITHOUT_WORKSHOP_KEY;
      const name = experience.workshopName ?? 'Sin taller indicado';

      const group = grouped.get(key);

      if (group) {
        group.experiences.push(experience);
        continue;
      }

      grouped.set(key, {
        key,
        name,
        experiences: [experience],
        average: 0,
      });
    }

    const groups = [...grouped.values()];

    for (const group of groups) {
      const total = group.experiences.reduce(
        (sum, experience) => sum + experience.rating,
        0,
      );

      group.average = total / group.experiences.length;
    }

    groups.sort((groupA, groupB) => {
      if (groupA.key === WITHOUT_WORKSHOP_KEY) {
        return 1;
      }

      if (groupB.key === WITHOUT_WORKSHOP_KEY) {
        return -1;
      }

      return groupA.name.localeCompare(groupB.name, 'es');
    });

    this.groups = groups;

    const selectionStillExists = groups.some(
      (group) => group.key === this.selectedGroupKey,
    );

    if (this.selectedGroupKey !== 'all' && !selectionStillExists) {
      this.selectedGroupKey = 'all';
    }
  }

  private isValidType(type: string | null): type is ExperienceType {
    return (
      type === 'workshops' ||
      type === 'rooms' ||
      type === 'friendly-spaces' ||
      type === 'hospitals'
    );
  }
}
