import { FormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonTitle, IonToolbar, ToastController } from '@ionic/angular/standalone';
import { CourierStateService } from '../../../services/courier/courier-state.service';

@Component({
  selector: 'app-courier-delivery-confirmation-page',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonInput, IonButton, FormsModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button /></ion-buttons>
        <ion-title>Ingresar código de confirmación</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-input fill="outline" label="Código" labelPlacement="floating" placeholder="1234" [(ngModel)]="confirmationCode" />

      <ion-button expand="block" color="success" class="ion-margin-top" (click)="confirm()">
        Confirmar entrega
      </ion-button>
    </ion-content>
  `,
})
export class CourierDeliveryConfirmationPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly state = inject(CourierStateService);
  private readonly toastController = inject(ToastController);

  confirmationCode = '';

  async confirm(): Promise<void> {
    const orderId = this.route.snapshot.paramMap.get('id') ?? '';
    const success = this.state.completeOrder(orderId, this.confirmationCode);

    const toast = await this.toastController.create({
      message: success ? 'Entrega confirmada exitosamente.' : 'Código inválido. Intenta nuevamente.',
      duration: 1800,
      color: success ? 'success' : 'danger',
    });
    await toast.present();

    if (success) {
      await this.router.navigate(['/courier/dashboard']);
    }
  }
}
