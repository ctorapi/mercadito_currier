import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';
import { CourierOrder } from '../../models/courier.model';

@Component({
  selector: 'app-courier-order-summary',
  standalone: true,
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, NgFor],
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>Resumen del pedido</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-list>
          <ion-item *ngFor="let item of order.items">
            <ion-label>{{ item.name }} x{{ item.quantity }}</ion-label>
          </ion-item>
        </ion-list>
      </ion-card-content>
    </ion-card>
  `,
})
export class CourierOrderSummaryComponent {
  @Input({ required: true }) order!: CourierOrder;
}
