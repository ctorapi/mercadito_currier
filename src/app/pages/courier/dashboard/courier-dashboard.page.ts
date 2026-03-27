import { NgIf } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonItem, IonLabel, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CourierOrderSummaryComponent } from '../../../components/courier/courier-order-summary.component';
import { CourierStatCardComponent } from '../../../components/courier/courier-stat-card.component';
import { CourierStatusChipComponent } from '../../../components/courier/courier-status-chip.component';
import { CourierStateService } from '../../../services/courier/courier-state.service';

@Component({
  selector: 'app-courier-dashboard-page',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    RouterLink,
    NgIf,
    CourierStatusChipComponent,
    CourierStatCardComponent,
    CourierOrderSummaryComponent,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Dashboard Motorista</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item lines="none">
        <ion-label>
          <h2>¡Hola, Carlos!</h2>
          <p>Estado actual</p>
        </ion-label>
        <app-courier-status-chip [isOnline]="driverState().isOnline" [isBusy]="driverState().isBusy" />
      </ion-item>

      <ion-card color="warning" *ngIf="showNewOrderAlert()">
        <ion-card-content>Nueva entrega disponible</ion-card-content>
      </ion-card>

      <div class="stats-grid">
        <app-courier-stat-card title="Entregas de hoy" [value]="stats().deliveriesToday" />
        <app-courier-stat-card title="Ganancia de hoy" [value]="stats().earningsToday" [isCurrency]="true" />
        <app-courier-stat-card title="Entregas del mes" [value]="stats().deliveriesMonth" />
        <app-courier-stat-card title="Saldo por cobrar" [value]="stats().balanceToCollect" [isCurrency]="true" />
      </div>

      <ion-button expand="block" [color]="driverState().isOnline ? 'danger' : 'success'" (click)="toggleConnection()">
        {{ driverState().isOnline ? 'Desconectarse' : 'Conectarse' }}
      </ion-button>

      <ion-button expand="block" fill="outline" color="warning" routerLink="/courier/nearby-orders">
        Ver pedidos cercanos
      </ion-button>

      <ng-container *ngIf="activeOrder() as order; else emptyState">
        <app-courier-order-summary [order]="order" />
        <ion-button expand="block" color="success" (click)="goToActiveOrder(order.id)">Ir al pedido</ion-button>
      </ng-container>

      <ng-template #emptyState>
        <ion-card>
          <ion-card-content>No tienes pedido asignado por ahora.</ion-card-content>
        </ion-card>
      </ng-template>
    </ion-content>
  `,
  styles: [
    `
      .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
    `,
  ],
})
export class CourierDashboardPage {
  private readonly router = inject(Router);
  readonly state = inject(CourierStateService);
  readonly driverState = this.state.driverState;
  readonly stats = this.state.stats;
  readonly activeOrder = this.state.activeOrder;
  readonly showNewOrderAlert = computed(() => this.driverState().isOnline && this.state.nearbyOrders().length > 0);

  toggleConnection(): void {
    this.state.setOnline(!this.driverState().isOnline);
  }

  goToActiveOrder(orderId: string): void {
    this.router.navigate(['/courier/order', orderId]);
  }
}
