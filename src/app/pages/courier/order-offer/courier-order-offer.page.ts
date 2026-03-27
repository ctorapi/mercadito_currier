import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CourierStateService } from '../../../services/courier/courier-state.service';

@Component({
  selector: 'app-courier-order-offer-page',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonCard, IonCardContent, IonButton, NgIf],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/courier/nearby-orders" /></ion-buttons>
        <ion-title>Detalle del pedido</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" *ngIf="order() as order">
      <ion-card color="light"><ion-card-content>Mapa / Ruta al comercio</ion-card-content></ion-card>
      <ion-card>
        <ion-card-content>
          <p><strong>Comercio:</strong> {{ order.merchantName }}</p>
          <p><strong>Dirección:</strong> {{ order.merchantAddress }}</p>
          <p><strong>Cliente:</strong> {{ order.customerName }}</p>
          <p><strong>Monto a cobrar:</strong> Q{{ order.amountToCollect | number : '1.2-2' }}</p>
          <p><strong>Distancia al comercio:</strong> {{ order.pickupDistanceKm }} km</p>
          <p><strong>ETA:</strong> {{ order.etaPickupMinutes }} min</p>
        </ion-card-content>
      </ion-card>

      <ion-button expand="block" color="success" (click)="accept(order.id)">Aceptar pedido</ion-button>
      <ion-button expand="block" fill="outline" color="warning" (click)="reject(order.id)">No me interesa</ion-button>
    </ion-content>
  `,
})
export class CourierOrderOfferPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly state = inject(CourierStateService);

  readonly order = () => {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    return this.state.getOrderById(id);
  };

  accept(orderId: string): void {
    this.state.acceptOrder(orderId);
    this.router.navigate(['/courier/order', orderId, 'pickup-navigation']);
  }

  reject(orderId: string): void {
    this.state.rejectOrder(orderId);
    this.router.navigate(['/courier/nearby-orders']);
  }
}
