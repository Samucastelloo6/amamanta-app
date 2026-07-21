import { DatePipe, NgClass } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Experience, ExperienceType } from '../../../core/models/experiencies';
import { ExperienceService } from '../../../core/services/experience.service';

@Component({
  selector: 'app-experience-section',
  imports: [DatePipe, NgClass, RouterLink],
  templateUrl: './experience-section.component.html',
  styleUrl: './experience-section.component.scss',
})
export class ExperienceSectionComponent implements OnInit, OnChanges {
  @Input() type?: ExperienceType;

  private readonly route = inject(ActivatedRoute);
  private readonly experienceService = inject(ExperienceService);

  experiences: Experience[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const routeType = params.get('type');

      if (!this.isValidType(routeType)) {
        this.type = undefined;
        this.experiences = [];
        return;
      }

      this.type = routeType;
      this.loadExperiences();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type']) {
      this.loadExperiences();
    }
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

  private loadExperiences(): void {
    if (!this.type) {
      this.experiences = [];
      return;
    }

    this.experiences = this.experienceService.getByType(this.type);
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
