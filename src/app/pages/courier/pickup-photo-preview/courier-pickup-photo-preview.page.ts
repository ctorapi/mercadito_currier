import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonImg, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CourierStateService } from '../../../services/courier/courier-state.service';

@Component({
  selector: 'app-courier-pickup-photo-preview-page',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonImg, IonButton, NgIf],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button /></ion-buttons>
        <ion-title>Fotografía del paquete</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-img *ngIf="photo() as photo" [src]="photo"></ion-img>
      <ion-button expand="block" color="success" (click)="confirm()">Confirmar</ion-button>
      <ion-button expand="block" fill="outline" color="warning" (click)="retake()">Tomar de nuevo</ion-button>
    </ion-content>
  `,
})
export class CourierPickupPhotoPreviewPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly state = inject(CourierStateService);

  readonly photo = this.state.tempPhoto;

  async confirm(): Promise<void> {
    const orderId = this.route.snapshot.paramMap.get('id') ?? '';
    this.state.confirmPickupPhoto(orderId);
    this.state.startDelivery(orderId);
    await this.router.navigate(['/courier/order', orderId, 'delivery-navigation']);
  }

  async retake(): Promise<void> {
    const orderId = this.route.snapshot.paramMap.get('id') ?? '';
    this.state.setTempPhoto(null);
    await this.router.navigate(['/courier/order', orderId, 'pickup-photo']);
  }
}
