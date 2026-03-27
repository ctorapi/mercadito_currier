export interface CourierOrderItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
}

export type CourierOrderStatus =
  | 'available'
  | 'accepted'
  | 'arrived_pickup'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered'
  | 'rejected';

export interface CourierOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  merchantName: string;
  merchantAddress: string;
  deliveryAddress: string;
  amountToCollect: number;
  pickupDistanceKm: number;
  deliveryDistanceKm: number;
  etaPickupMinutes: number;
  etaDeliveryMinutes: number;
  status: CourierOrderStatus;
  items: CourierOrderItem[];
  confirmationCode: string;
  photo?: string | null;
  merchantLat: number;
  merchantLng: number;
  customerLat: number;
  customerLng: number;
}

export interface CourierDashboardStats {
  deliveriesToday: number;
  earningsToday: number;
  deliveriesMonth: number;
  balanceToCollect: number;
}

export interface CourierDriverState {
  isOnline: boolean;
  isBusy: boolean;
  activeOrderId: string | null;
}
