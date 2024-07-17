import { Routes } from "@angular/router";

export const GAMING_ROUTES: Routes = [
    {
        path: 'gaming-vouchers',
        data: {
            title: 'Gaming Vouchers',
            roles: ['customer'],
            permission: ['gaming-vouchers']
        },
        loadComponent: () => import('../../customer/vouchers/gaming-vouchers/gaming-vouchers.component').then(m => m.GamingVouchersComponent)
    },
    {
        path: 'gaming-vouchers-buynow',
        data: {
            title: 'Gaming Vouchers',
            roles: ['customer'],
            permission: ['gaming-vouchers-buynow']
        },
        loadComponent: () => import('../../customer/vouchers/gaming-vouchers-buynow/gaming-vouchers-buynow.component').then(m => m.GamingVouchersBuynowComponent)
    },
    {
        path: 'subscription-vouchers',
        data: {
            title: 'Subscription Vouchers',
            roles: ['customer'],
            permission: ['subscription-vouchers']
        },
        loadComponent: () => import('../../customer/vouchers/subscription-vouchers/subscription-vouchers.component').then(m => m.SubscriptionVouchersComponent)
    },
]