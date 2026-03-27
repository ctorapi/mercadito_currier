import { DecimalPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-courier-stat-card',
  standalone: true,
  imports: [IonCard, IonCardContent, DecimalPipe, NgIf],
  template: `
    <ion-card>
      <ion-card-content>
        <small>{{ title }}</small>
        <h2 *ngIf="isCurrency; else plain">Q{{ value | number : '1.2-2' }}</h2>
        <ng-template #plain><h2>{{ value }}</h2></ng-template>
      </ion-card-content>
    </ion-card>
  `,
})
export class CourierStatCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: number;
  @Input() isCurrency = false;
}
