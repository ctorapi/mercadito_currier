import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CourierRouteActionsComponent } from '../../../components/courier/courier-route-actions.component';
import { CourierExternalActionsService } from '../../../services/courier/courier-external-actions.service';
import { CourierStateService } from '../../../services/courier/courier-state.service';

@Component({
  selector: 'app-courier-delivery-navigation-page',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonCard, IonCardContent, IonButton, NgIf, CourierRouteActionsComponent],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button /></ion-buttons>
        <ion-title>En camino a la entrega</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" *ngIf="order() as order">
      <ion-card color="light"><ion-card-content>Mapa / Ruta hacia cliente</ion-card-content></ion-card>
      <ion-card>
        <ion-card-content>
          <p><strong>Cliente:</strong> {{ order.customerName }}</p>
          <p><strong>Dirección de entrega:</strong> {{ order.deliveryAddress }}</p>
          <p><strong>Monto a cobrar:</strong> Q{{ order.amountToCollect | number : '1.2-2' }}</p>
          <p><strong>Distancia al domicilio:</strong> {{ order.deliveryDistanceKm }} km</p>
          <p><strong>ETA:</strong> {{ order.etaDeliveryMinutes }} min</p>
        </ion-card-content>
      </ion-card>

      <app-courier-route-actions (google)="openGoogle()" (waze)="openWaze()" />

      <ion-button expand="block" color="success" (click)="goDetails(order.id)">Regresar al Pedido</ion-button>
    </ion-content>
  `,
})
export class CourierDeliveryNavigationPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly externalActions = inject(CourierExternalActionsService);
  private readonly state = inject(CourierStateService);

  readonly order = () => this.state.getOrderById(this.route.snapshot.paramMap.get('id') ?? '');

  async openGoogle(): Promise<void> {
    const order = this.order();
    if (!order) return;
    await this.externalActions.openGoogleMaps(order.customerLat, order.customerLng);
  }

  async openWaze(): Promise<void> {
    const order = this.order();
    if (!order) return;
    await this.externalActions.openWaze(order.customerLat, order.customerLng);
  }

  goDetails(orderId: string): void {
    this.router.navigate(['/courier/order', orderId, 'delivery-details']);
  }
}
