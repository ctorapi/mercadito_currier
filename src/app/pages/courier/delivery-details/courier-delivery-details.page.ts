import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { callOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { CourierOrderSummaryComponent } from '../../../components/courier/courier-order-summary.component';
import { CourierExternalActionsService } from '../../../services/courier/courier-external-actions.service';
import { CourierStateService } from '../../../services/courier/courier-state.service';

@Component({
  selector: 'app-courier-delivery-details-page',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonCard, IonCardContent, IonItem, IonLabel, IonIcon, IonButton, NgIf, CourierOrderSummaryComponent],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button /></ion-buttons>
        <ion-title>Detalle de entrega</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" *ngIf="order() as order">
      <ion-card>
        <ion-card-content>
          <p><strong>Cliente:</strong> {{ order.customerName }}</p>
          <p><strong>Dirección de entrega:</strong> {{ order.deliveryAddress }}</p>
          <p><strong>Monto a cobrar:</strong> Q{{ order.amountToCollect | number : '1.2-2' }}</p>
          <p><strong>Distancia al domicilio:</strong> {{ order.deliveryDistanceKm }} km</p>
        </ion-card-content>
      </ion-card>

      <ion-item button="true" (click)="call(order.customerPhone)">
        <ion-icon slot="start" name="call-outline"></ion-icon>
        <ion-label>{{ order.customerPhone }}</ion-label>
      </ion-item>

      <app-courier-order-summary [order]="order" />

      <ion-button expand="block" color="success" (click)="markDelivered(order.id)">Marcar entregado</ion-button>
    </ion-content>
  `,
})
export class CourierDeliveryDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly externalActions = inject(CourierExternalActionsService);
  private readonly state = inject(CourierStateService);

  readonly order = () => this.state.getOrderById(this.route.snapshot.paramMap.get('id') ?? '');

  constructor() {
    addIcons({ callOutline });
  }

  call(phone: string): void {
    this.externalActions.callPhone(phone);
  }

  markDelivered(orderId: string): void {
    this.router.navigate(['/courier/order', orderId, 'delivery-confirmation']);
  }
}
