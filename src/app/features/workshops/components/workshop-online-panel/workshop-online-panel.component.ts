import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Workshop } from '../../../../core/models/workshop';

@Component({
  selector: 'app-workshop-online-panel',
  imports: [RouterLink],
  templateUrl: './workshop-online-panel.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WorkshopOnlinePanelComponent {
  @Input({ required: true }) workshop!: Workshop;

  readonly registrationEmail = 'inscripciones@amamanta.es';
}
