import { Injectable } from '@angular/core';
import { Browser } from '@capacitor/browser';

@Injectable({ providedIn: 'root' })
export class CourierExternalActionsService {
  async openGoogleMaps(lat: number, lng: number): Promise<void> {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    await this.openUrl(url);
  }

  async openWaze(lat: number, lng: number): Promise<void> {
    const url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
    await this.openUrl(url);
  }

  async callPhone(phone: string): Promise<void> {
    const telUrl = `tel:${phone}`;
    try {
      await this.openUrl(telUrl);
    } catch {
      window.location.href = telUrl;
    }
  }

  private async openUrl(url: string): Promise<void> {
    try {
      await Browser.open({ url });
    } catch {
      window.open(url, '_blank', 'noopener');
    }
  }
}
