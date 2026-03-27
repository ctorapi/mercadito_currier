import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/angular/standalone';
import { CourierOrder } from '../../models/courier.model';

@Component({
  selector: 'app-courier-order-card',
  standalone: true,
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton],
  template: `
    <ion-card button="true" (click)="open.emit(order.id)">
      <ion-card-header>
        <ion-card-title>{{ order.merchantName }}</ion-card-title>
        <ion-card-subtitle>{{ order.merchantAddress }}</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <p><strong>Monto a cobrar:</strong> Q{{ order.amountToCollect | number : '1.2-2' }}</p>
        <p><strong>Distancia al comercio:</strong> {{ order.pickupDistanceKm }} km</p>
        <p><strong>ETA:</strong> {{ order.etaPickupMinutes }} min</p>
        <ion-button expand="block" color="success" (click)="accept.emit(order.id); $event.stopPropagation()">
          Aceptar
        </ion-button>
      </ion-card-content>
    </ion-card>
  `,
})
export class CourierOrderCardComponent {
  @Input({ required: true }) order!: CourierOrder;
  @Output() open = new EventEmitter<string>();
  @Output() accept = new EventEmitter<string>();
}
