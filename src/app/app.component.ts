import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/components/header/header.component';
import { FooterComponent } from './layout/components/footer/footer.component';
import { ResourcesComponent } from './features/resources/pages/resources/resources.component';
import { MapComponent } from './features/map/pages/map/map.component';
import { CommunityComponent } from './features/community/pages/community/community.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent,ResourcesComponent,MapComponent,CommunityComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'amamanta-app';
}
