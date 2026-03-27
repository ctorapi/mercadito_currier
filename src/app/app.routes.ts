import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'courier/dashboard' },
  {
    path: 'courier/dashboard',
    loadComponent: () => import('./pages/courier/dashboard/courier-dashboard.page').then((m) => m.CourierDashboardPage),
  },
  {
    path: 'courier/nearby-orders',
    loadComponent: () => import('./pages/courier/nearby-orders/courier-nearby-orders.page').then((m) => m.CourierNearbyOrdersPage),
  },
  {
    path: 'courier/order/:id',
    loadComponent: () => import('./pages/courier/order-offer/courier-order-offer.page').then((m) => m.CourierOrderOfferPage),
  },
  {
    path: 'courier/order/:id/pickup-navigation',
    loadComponent: () => import('./pages/courier/pickup-navigation/courier-pickup-navigation.page').then((m) => m.CourierPickupNavigationPage),
  },
  {
    path: 'courier/order/:id/pickup-details',
    loadComponent: () => import('./pages/courier/pickup-details/courier-pickup-details.page').then((m) => m.CourierPickupDetailsPage),
  },
  {
    path: 'courier/order/:id/pickup-photo',
    loadComponent: () => import('./pages/courier/pickup-photo/courier-pickup-photo.page').then((m) => m.CourierPickupPhotoPage),
  },
  {
    path: 'courier/order/:id/pickup-photo-preview',
    loadComponent: () => import('./pages/courier/pickup-photo-preview/courier-pickup-photo-preview.page').then((m) => m.CourierPickupPhotoPreviewPage),
  },
  {
    path: 'courier/order/:id/delivery-navigation',
    loadComponent: () => import('./pages/courier/delivery-navigation/courier-delivery-navigation.page').then((m) => m.CourierDeliveryNavigationPage),
  },
  {
    path: 'courier/order/:id/delivery-details',
    loadComponent: () => import('./pages/courier/delivery-details/courier-delivery-details.page').then((m) => m.CourierDeliveryDetailsPage),
  },
  {
    path: 'courier/order/:id/delivery-confirmation',
    loadComponent: () => import('./pages/courier/delivery-confirmation/courier-delivery-confirmation.page').then((m) => m.CourierDeliveryConfirmationPage),
  },
];
