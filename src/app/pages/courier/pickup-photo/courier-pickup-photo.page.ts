import { NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ToastController } from '@ionic/angular/standalone';
import { cameraOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { CourierStateService } from '../../../services/courier/courier-state.service';

@Component({
  selector: 'app-courier-pickup-photo-page',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonCard, IonCardContent, IonIcon, IonButton, NgIf],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button /></ion-buttons>
        <ion-title>Fotografía del paquete</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-content class="photo-box">
          <ion-icon name="camera-outline" size="large"></ion-icon>
          <p>Toma una Fotografía del paquete</p>
          <ion-button expand="block" color="success" (click)="openCamera()">Abrir cámara</ion-button>
        </ion-card-content>
      </ion-card>
      <input #fileInput type="file" accept="image/*" hidden (change)="onFileSelected($event)" />
    </ion-content>
  `,
  styles: [`.photo-box{display:flex;flex-direction:column;gap:10px;align-items:center;justify-content:center;min-height:220px}`],
})
export class CourierPickupPhotoPage {
  @ViewChild('fileInput') private readonly fileInput?: ElementRef<HTMLInputElement>;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly state = inject(CourierStateService);
  private readonly toastController = inject(ToastController);

  constructor() {
    addIcons({ cameraOutline });
  }

  async openCamera(): Promise<void> {
    const orderId = this.route.snapshot.paramMap.get('id') ?? '';

    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (image.dataUrl) {
        this.state.setTempPhoto(image.dataUrl);
        await this.router.navigate(['/courier/order', orderId, 'pickup-photo-preview']);
      }
    } catch {
      this.fileInput?.nativeElement.click();
      const toast = await this.toastController.create({
        message: 'No se pudo abrir la Cámara. Usa selección de imagen.',
        duration: 1800,
        color: 'warning',
      });
      await toast.present();
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const orderId = this.route.snapshot.paramMap.get('id') ?? '';
      this.state.setTempPhoto(reader.result as string);
      await this.router.navigate(['/courier/order', orderId, 'pickup-photo-preview']);
    };
    reader.readAsDataURL(file);
  }
}
