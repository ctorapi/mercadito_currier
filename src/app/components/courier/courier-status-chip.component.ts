import { Component, Input } from '@angular/core';
import { IonBadge } from '@ionic/angular/standalone';

@Component({
  selector: 'app-courier-status-chip',
  standalone: true,
  imports: [IonBadge],
  template: `<ion-badge [color]="color">{{ label }}</ion-badge>`,
})
export class CourierStatusChipComponent {
  @Input() isOnline = false;
  @Input() isBusy = false;

  get label(): string {
    if (!this.isOnline) return 'Desconectado';
    return this.isBusy ? 'Ocupado' : 'Disponible';
  }

  get color(): string {
    if (!this.isOnline) return 'medium';
    return this.isBusy ? 'warning' : 'success';
  }
}
