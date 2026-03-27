import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CourierRouteActionsComponent } from '../../../components/courier/courier-route-actions.component';
import { CourierExternalActionsService } from '../../../services/courier/courier-external-actions.service';
import { CourierStateService } from '../../../services/courier/courier-state.service';

@Component({
  selector: 'app-courier-pickup-navigation-page',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonCard, IonCardContent, IonButton, NgIf, CourierRouteActionsComponent],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/courier/dashboard" /></ion-buttons>
        <ion-title>Dirígete al punto de recolección</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" *ngIf="order() as order">
      <ion-card color="light"><ion-card-content>Mapa / Ruta al punto de recolección</ion-card-content></ion-card>
      <ion-card>
        <ion-card-content>
          <p><strong>Comercio:</strong> {{ order.merchantName }}</p>
          <p><strong>Dirección:</strong> {{ order.merchantAddress }}</p>
          <p><strong>Distancia al comercio:</strong> {{ order.pickupDistanceKm }} km</p>
          <p><strong>ETA:</strong> {{ order.etaPickupMinutes }} min</p>
        </ion-card-content>
      </ion-card>

      <app-courier-route-actions (google)="openGoogle()" (waze)="openWaze()" />

      <ion-button expand="block" color="success" (click)="arrived(order.id)">Estoy en el punto de recolección</ion-button>
      <ion-button expand="block" fill="outline" (click)="goToOrder(order.id)">Regresar al Pedido</ion-button>
    </ion-content>
  `,
})
export class CourierPickupNavigationPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly externalActions = inject(CourierExternalActionsService);
  private readonly state = inject(CourierStateService);

  readonly order = () => this.state.getOrderById(this.route.snapshot.paramMap.get('id') ?? '');

  async openGoogle(): Promise<void> {
    const order = this.order();
    if (!order) return;
    await this.externalActions.openGoogleMaps(order.merchantLat, order.merchantLng);
  }

  async openWaze(): Promise<void> {
    const order = this.order();
    if (!order) return;
    await this.externalActions.openWaze(order.merchantLat, order.merchantLng);
  }

  arrived(orderId: string): void {
    this.state.markArrivedAtPickup(orderId);
    this.router.navigate(['/courier/order', orderId, 'pickup-details']);
  }

  goToOrder(orderId: string): void {
    this.router.navigate(['/courier/order', orderId]);
  }
}
