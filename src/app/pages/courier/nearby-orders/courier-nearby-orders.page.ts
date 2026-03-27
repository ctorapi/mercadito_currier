import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CourierOrderCardComponent } from '../../../components/courier/courier-order-card.component';
import { CourierStateService } from '../../../services/courier/courier-state.service';

@Component({
  selector: 'app-courier-nearby-orders-page',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, NgFor, CourierOrderCardComponent],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/courier/dashboard" /></ion-buttons>
        <ion-title>Pedidos cercanos</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <app-courier-order-card
        *ngFor="let order of state.nearbyOrders()"
        [order]="order"
        (open)="openOffer($event)"
        (accept)="accept($event)"
      />
    </ion-content>
  `,
})
export class CourierNearbyOrdersPage {
  readonly state = inject(CourierStateService);
  private readonly router = inject(Router);

  openOffer(orderId: string): void {
    this.router.navigate(['/courier/order', orderId]);
  }

  accept(orderId: string): void {
    this.state.acceptOrder(orderId);
    this.router.navigate(['/courier/order', orderId, 'pickup-navigation']);
  }
}
