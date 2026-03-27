import { Component, EventEmitter, Output } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-courier-route-actions',
  standalone: true,
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton],
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>Abrir con</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-button expand="block" fill="outline" (click)="google.emit()">Google Maps</ion-button>
        <ion-button expand="block" fill="outline" color="warning" (click)="waze.emit()">Waze</ion-button>
      </ion-card-content>
    </ion-card>
  `,
})
export class CourierRouteActionsComponent {
  @Output() google = new EventEmitter<void>();
  @Output() waze = new EventEmitter<void>();
}
