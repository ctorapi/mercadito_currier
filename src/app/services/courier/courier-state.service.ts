import { Injectable, computed, signal } from '@angular/core';
import {
  CourierDashboardStats,
  CourierDriverState,
  CourierOrder,
  CourierOrderStatus,
} from '../../models/courier.model';

@Injectable({ providedIn: 'root' })
export class CourierStateService {
  private readonly ordersSignal = signal<CourierOrder[]>([
    {
      id: 'order-1001',
      merchantName: 'Café Central',
      merchantAddress: 'Calle Primavera #123',
      customerName: 'Ana Martínez',
      customerPhone: '+50255554444',
      deliveryAddress: 'Avenida 456, Colonia del Valle',
      amountToCollect: 38,
      pickupDistanceKm: 4.6,
      deliveryDistanceKm: 2.5,
      etaPickupMinutes: 25,
      etaDeliveryMinutes: 7,
      confirmationCode: '1234',
      status: 'available',
      photo: null,
      merchantLat: 14.6349,
      merchantLng: -90.5069,
      customerLat: 14.6211,
      customerLng: -90.5201,
      items: [
        { id: 'i-1', name: 'Leche (2L)', quantity: 3 },
        { id: 'i-2', name: 'Pan de caja', quantity: 1 },
        { id: 'i-3', name: 'Arroz (1kg)', quantity: 2 },
        { id: 'i-4', name: 'Huevos (12 unidades)', quantity: 1 },
      ],
    },
    {
      id: 'order-1002',
      merchantName: 'Mercado San José',
      merchantAddress: 'Zona 1, 5a calle 14-28',
      customerName: 'Carlos Ramos',
      customerPhone: '+50255551111',
      deliveryAddress: 'Residenciales El Prado, casa 18',
      amountToCollect: 68,
      pickupDistanceKm: 2.1,
      deliveryDistanceKm: 3.2,
      etaPickupMinutes: 12,
      etaDeliveryMinutes: 11,
      confirmationCode: '4521',
      status: 'available',
      photo: null,
      merchantLat: 14.6422,
      merchantLng: -90.513,
      customerLat: 14.653,
      customerLng: -90.498,
      items: [{ id: 'i-5', name: 'Canasta básica', quantity: 1 }],
    },
    {
      id: 'order-1003',
      merchantName: 'Super Ahorro Express',
      merchantAddress: 'Boulevard Liberación 10-22',
      customerName: 'Laura Pérez',
      customerPhone: '+50255552222',
      deliveryAddress: 'Colonia Oakland, apto 3B',
      amountToCollect: 138,
      pickupDistanceKm: 5.4,
      deliveryDistanceKm: 4.1,
      etaPickupMinutes: 20,
      etaDeliveryMinutes: 16,
      confirmationCode: '9078',
      status: 'available',
      photo: null,
      merchantLat: 14.6088,
      merchantLng: -90.512,
      customerLat: 14.597,
      customerLng: -90.501,
      items: [{ id: 'i-6', name: 'Compra semanal', quantity: 1 }],
    },
    {
      id: 'order-1004',
      merchantName: 'Bodega del Valle',
      merchantAddress: 'Calle Reforma 8-11',
      customerName: 'Mario López',
      customerPhone: '+50255553333',
      deliveryAddress: 'Zona 14, edificio Vista',
      amountToCollect: 54,
      pickupDistanceKm: 3.5,
      deliveryDistanceKm: 2.9,
      etaPickupMinutes: 14,
      etaDeliveryMinutes: 10,
      confirmationCode: '6612',
      status: 'available',
      photo: null,
      merchantLat: 14.616,
      merchantLng: -90.497,
      customerLat: 14.605,
      customerLng: -90.486,
      items: [{ id: 'i-7', name: 'Frutas y vegetales', quantity: 1 }],
    },
  ]);

  private readonly driverStateSignal = signal<CourierDriverState>({
    isOnline: false,
    isBusy: false,
    activeOrderId: null,
  });

  private readonly statsSignal = signal<CourierDashboardStats>({
    deliveriesToday: 4,
    earningsToday: 216,
    deliveriesMonth: 52,
    balanceToCollect: 38,
  });

  private readonly tempPhotoSignal = signal<string | null>(null);

  readonly nearbyOrders = computed(() => this.ordersSignal().filter((o) => o.status === 'available'));
  readonly activeOrder = computed(() => {
    const activeOrderId = this.driverStateSignal().activeOrderId;
    return this.ordersSignal().find((o) => o.id === activeOrderId) ?? null;
  });
  readonly stats = this.statsSignal.asReadonly();
  readonly driverState = this.driverStateSignal.asReadonly();
  readonly tempPhoto = this.tempPhotoSignal.asReadonly();

  setOnline(isOnline: boolean): void {
    this.driverStateSignal.update((state) => ({ ...state, isOnline, isBusy: isOnline ? state.isBusy : false, activeOrderId: isOnline ? state.activeOrderId : null }));
  }

  getOrderById(id: string): CourierOrder | null {
    return this.ordersSignal().find((order) => order.id === id) ?? null;
  }

  acceptOrder(orderId: string): void {
    this.patchOrderStatus(orderId, 'accepted');
    this.driverStateSignal.update((state) => ({ ...state, isOnline: true, isBusy: true, activeOrderId: orderId }));
    this.statsSignal.update((stats) => ({ ...stats, balanceToCollect: this.getOrderById(orderId)?.amountToCollect ?? stats.balanceToCollect }));
  }

  rejectOrder(orderId: string): void {
    this.patchOrderStatus(orderId, 'rejected');
  }

  markArrivedAtPickup(orderId: string): void {
    this.patchOrderStatus(orderId, 'arrived_pickup');
  }

  setTempPhoto(photo: string | null): void {
    this.tempPhotoSignal.set(photo);
  }

  confirmPickupPhoto(orderId: string): void {
    const photo = this.tempPhotoSignal();
    if (!photo) return;
    this.ordersSignal.update((orders) =>
      orders.map((order) =>
        order.id === orderId ? { ...order, photo, status: 'picked_up' as CourierOrderStatus } : order,
      ),
    );
    this.tempPhotoSignal.set(null);
  }

  startDelivery(orderId: string): void {
    this.patchOrderStatus(orderId, 'on_the_way');
  }

  completeOrder(orderId: string, code: string): boolean {
    const order = this.getOrderById(orderId);
    if (!order || order.confirmationCode !== code) {
      return false;
    }

    this.patchOrderStatus(orderId, 'delivered');
    this.driverStateSignal.update((state) => ({ ...state, isBusy: false, activeOrderId: null, isOnline: true }));
    this.statsSignal.update((stats) => ({
      deliveriesToday: stats.deliveriesToday + 1,
      deliveriesMonth: stats.deliveriesMonth + 1,
      earningsToday: stats.earningsToday + order.amountToCollect,
      balanceToCollect: 0,
    }));

    return true;
  }

  private patchOrderStatus(orderId: string, status: CourierOrderStatus): void {
    this.ordersSignal.update((orders) =>
      orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
    );
  }
}
