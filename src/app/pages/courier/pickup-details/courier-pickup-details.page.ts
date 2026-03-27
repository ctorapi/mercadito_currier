import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonAccordion, IonAccordionGroup, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonItem, IonLabel, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CourierStateService } from '../../../services/courier/courier-state.service';

@Component({
  selector: 'app-courier-pickup-details-page',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonCard, IonCardContent, IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonButton, RouterLink, NgIf, NgFor],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button /></ion-buttons>
        <ion-title>Detalles de recolección</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" *ngIf="order() as order">
      <ion-card>
        <ion-card-content>
          <p><strong>Comercio:</strong> {{ order.merchantName }}</p>
          <p><strong>Dirección de recolección:</strong> {{ order.merchantAddress }}</p>
          <p><strong>Monto a cobrar:</strong> Q{{ order.amountToCollect | number : '1.2-2' }}</p>
          <p><strong>Distancia al domicilio:</strong> {{ order.deliveryDistanceKm }} km</p>
          <p><strong>ETA de entrega:</strong> {{ order.etaDeliveryMinutes }} min</p>
        </ion-card-content>
      </ion-card>

      <ion-button expand="block" fill="outline" [routerLink]="['/courier/order', order.id]">Ver detalles del pedido</ion-button>

      <ion-accordion-group>
        <ion-accordion value="productos">
          <ion-item slot="header"><ion-label>Productos</ion-label></ion-item>
          <div slot="content">
            <ion-item *ngFor="let item of order.items"><ion-label>{{ item.name }} x{{ item.quantity }}</ion-label></ion-item>
          </div>
        </ion-accordion>
      </ion-accordion-group>

      <ion-card color="warning">
        <ion-card-content>Asegúrate de recoger todos los productos antes de continuar.</ion-card-content>
      </ion-card>

      <ion-button expand="block" color="success" (click)="goToPhoto(order.id)">Subir fotografía</ion-button>
    </ion-content>
  `,
})
export class CourierPickupDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly state = inject(CourierStateService);

  readonly order = () => this.state.getOrderById(this.route.snapshot.paramMap.get('id') ?? '');

  goToPhoto(orderId: string): void {
    this.router.navigate(['/courier/order', orderId, 'pickup-photo']);
  }
}
