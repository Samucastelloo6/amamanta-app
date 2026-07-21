import { Injectable, signal } from '@angular/core';
import { Experience, ExperienceType } from '../models/experiencies';

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  private readonly experiences = signal<Experience[]>([
    {
      id: 'workshop-1',
      type: 'workshops',
      rating: 5,
      text: 'Me sentí muy acompañada y pude resolver dudas que llevaba tiempo arrastrando.',
      improvement: '',
      date: '2026-06-12',
    },
    {
      id: 'room-1',
      type: 'rooms',
      rating: 4,
      text: 'La sala me permitió dar el pecho con tranquilidad en un momento en el que lo necesitaba.',
      improvement: '',
      date: '2026-06-15',
    },
    {
      id: 'friendly-space-1',
      type: 'friendly-spaces',
      rating: 5,
      text: 'Me atendieron con mucha naturalidad y me sentí cómoda lactando allí.',
      improvement: '',
      date: '2026-06-18',
    },
  ]);

  getByType(type: ExperienceType): Experience[] {
    return this.experiences()
      .filter((experience) => experience.type === type)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  getAdminExperiences(): Experience[] {
    return [...this.experiences()].sort((a, b) => b.date.localeCompare(a.date));
  }

  getExperienceById(experienceId: string): Experience | undefined {
    return this.experiences().find(
      (experience) => experience.id === experienceId,
    );
  }

  addExperience(experience: Experience): void {
    this.experiences.update((experiences) => [experience, ...experiences]);
  }

  updateExperience(updatedExperience: Experience): void {
    this.experiences.update((experiences) =>
      experiences.map((experience) =>
        experience.id === updatedExperience.id ? updatedExperience : experience,
      ),
    );
  }

  deleteExperience(experienceId: string): void {
    this.experiences.update((experiences) =>
      experiences.filter((experience) => experience.id !== experienceId),
    );
  }
}
