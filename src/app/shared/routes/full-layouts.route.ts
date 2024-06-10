import {Routes} from "@angular/router";

export const FULL_ROUTES: Routes = [
    // dashboard routing
    {
        path: 'dashboard/admin',
        data: {
            title: 'Admin Dashboard',
            roles: ['admin'],
            permission: ['view_admin_dashboard']
        },
        loadChildren: () => import('../../admin/analytic-dashboard/analytic-dashboard.module').then(m => m.AnalyticDashboardModule),
    },
    {
        path: 'dashboard/sub_admin',
        data: {
            title: 'Admin Dashboard',
            roles: ['admin', 'sub_admin'],
            permission: ['view_admin_dashboard']
        },
        loadChildren: () => import('../../admin/analytic-dashboard/analytic-dashboard.module').then(m => m.AnalyticDashboardModule),
    },
    {
        path: 'dashboard/retailer',
        data: {
            title: 'Retailer Dashboard',
            roles: ['retailer', 'distributor'],
            permission: ['view_retailer_dashboard']
        },
        loadChildren: () => import('../../retailer/dashboard/dashboard.module').then(m => m.DashboardModule)
    },

    // admin
    {
        path: 'admin/permissions',
        data: {
            title: 'Admin Permissions',
            roles: ['admin'],
            permission: ['view_admin_permission']
        },
        loadChildren: () => import('../../admin/permissions/permissions.module').then(m => m.PermissionsModule)
    },
    {
        path: 'admin/manage-wallets',
        data: {
            title: 'Admin Manage-Wallets',
            roles: ['admin'],
            permission: ['manage_wallets']
        },
        loadChildren: () => import('../../admin/manage-wallets/manage-wallets.module').then(m => m.ManageWalletsModule)
    },
    {
        path: 'admin/roles',
        data: {
            title: 'Admin Roles',
            roles: ['admin'],
            permission: ['view_admin_roles']
        },
        loadChildren: () => import('../../admin/roles/roles.module').then(m => m.RolesModule)
    },
    {
        path: 'admin/master',
        data: {
            title: 'Admin Master',
            roles: ['admin'],
            permission: ['view_admin_master']
        },
        loadChildren: () => import('../../admin/master/master.module').then(m => m.MasterModule)
    },
    {
        path: 'admin/manual-refund',
        data: {
            title: 'Admin Manual Refund',
            roles: ['admin'],
            permission: ['view_admin_manual_refund']
        },
        loadChildren: () => import('../../admin/manual-refund/manual-refund.module').then(m => m.ManualRefundModule)
    },
    {
        path: 'admin/partner',
        data: {
            title: 'Admin Partner',
            roles: ['admin'],
            permission: ['view_admin_partner']
        },
        loadChildren: () => import('../../admin/partner/partner.module').then(m => m.PartnerModule)
    },
    {
        path: 'admin/reporting',
        data: {
            title: 'Admin Reporting',
            roles: ['admin'],
            permission: ['view_admin_reporting']
        },
        loadChildren: () => import('../../admin/reporting/reporting.module').then(m => m.ReportingModule)
    },
    {
        path: 'admin/manage-product',
        data: {
            title: 'Admin Manage Products',
            roles: ['admin'],
            permission: ['manage_products']
        },
        loadChildren: () => import('../../admin/manage-product/manage-product.module').then(m => m.ManageProductModule)
    },
    {
        path: 'admin/manage-banks',
        data: {
            title: 'Admin Manage Banks',
            roles: ['admin'],
            permission: ['manage_banks']
        },
        loadChildren: () => import('../../admin/manage-banks/manage-banks.module').then(m => m.ManageBanksModule)
    },
    {
        path: 'admin/manage-users/manage-corporates',
        data: {
            title: 'Admin Manage Corporates',
            roles: ['admin'],
            permission: ['manage_admin_corporates']
        },
        loadChildren: () => import('../../admin/manage-users/manage-corporates/manage-corporates.module').then(m => m.ManageCorporatesModule)
    },
    {
        path: 'admin/manage-users/manage-customer',
        data: {
            title: 'Admin Manage Customer',
            roles: ['admin'],
            permission: ['manage_admin_customer']
        },
        loadChildren: () => import('../../admin/manage-users/manage-customer/manage-customer.module').then(m => m.ManageCustomerModule)
    },
    {
        path: 'admin/manage-users/manage-promote-requests',
        data: {
            title: 'Admin Manage Promote Requests',
            roles: ['admin'],
            permission: ['manage_admin_promote_requests']
        },
        loadComponent: () => import('../../admin/manage-users/manage-promote-requests/manage-promote-requests.component').then(m => m.ManagePromoteRequestsComponent)
    },
    {
        path: 'admin/manage-users/manage-map-user',
        data: {
            title: 'Admin Manage Map User',
            roles: ['admin'],
            permission: ['manage_admin_map_user']
        },
        loadChildren: () => import('../../admin/manage-users/manage-map-user/manage-map-user.module').then(m => m.ManageMapUserModule)
    },
    {
        path: 'admin/manage-users/manage-sub-admin',
        data: {
            title: 'Manage Sub-Admin',
            roles: ['admin'],
            permission: ['manage_sub_admin']
        },
        loadChildren: () => import('../../admin/manage-users/manage-sub-admin/manage-sub-admin.module').then(m => m.ManageSubAdminModule)
    },
    {
        path: 'admin/manage-users/manage-employee',
        data: {
            title: 'Manage Employee',
            roles: ['admin'],
            permission: ['manage_employee']
        },
        loadChildren: () => import('../../admin/manage-users/manage-employee/manage-employee.module').then(m => m.ManageEmployeeModule)
    },
    {
        path: 'manage-balance',
        data: {
            title: 'Admin Manage Balance',
            roles: ['admin'],
            permission: ['manage_admin_balance']
        },
        loadChildren: () => import('../../admin/manage-balance/manage-balance.module').then(m => m.ManageBalanceModule)
    },
    {
        path: 'manage-support-ticket',
        data: {
            title: 'Admin Manage Support Ticket',
            roles: ['admin'],
            permission: ['manage_admin_support_ticket']
        },
        loadChildren: () => import('../../admin/support-ticket/support-ticket.module').then(m => m.SupportTicketModule)
    }, {
        path: 'manage-notifications',
        data: {
            title: 'Admin Manage notification',
            roles: ['admin'],
            permission: ['manage_admin_notification']
        },
        loadChildren: () => import('../../admin/manage-notifications/manage-notifications.module').then(m => m.ManageNotificationsModule)
    },
    {
        path: 'manage-gc',
        data: {
            title: 'Admin Manage Customer',
            roles: ['admin'],
            permission: ['manage_admin_customer']
        },
        loadChildren: () => import('../../admin/manage-gift-card/manage-gift-card.module').then(m => m.ManageGiftCardModule)
    },
    {
        path: 'department',
        data: {
            title: 'Admin Department',
            roles: ['admin'],
            permission: ['manage_admin_customer']
        },
        loadChildren: () => import('../../admin/department/department.module').then(m => m.DepartmentModule)
    },
    {
        path: 'card-transaction',
        data: {
            title: 'Admin Card Transactions',
            roles: ['admin'],
            permission: ['manage_admin_customer']
        },
        loadChildren: () => import('../../admin/card-transaction/card-transaction.module').then(m => m.CardTransactionModule)
    },
    {
        path: 'wallet-transaction',
        data: {
            title: 'Admin Wallet Transaction',
            roles: ['admin'],
            permission: ['wallet_admin_transaction']
        },
        loadChildren: () => import('../../admin/wallet-transaction/wallet-transaction.module').then(m => m.WalletTransactionModule)
    },
    {
        path: 'pool-transaction',
        data: {
            title: 'Admin Wallet Daily Transaction',
            roles: ['admin'],
            permission: ['wallet_daily_admin_transaction']
        },
        loadChildren: () => import('../../admin/pool-management/pool-management.module').then(m => m.PoolManagementModule)
    },

    //user profile
    {
        path: 'users/profile',
        data: {
            title: 'Admin User Profile',
            roles: ['admin'],
            permission: ['user_admin_profile']
        },
        loadChildren: () => import('../../users/profile/profile.module').then(m => m.ProfileModule)
    },
    {
        path: 'users/manage-account',
        data: {
            title: 'Admin Manage Account',
            roles: ['admin'],
            permission: ['manage_admin_account']
        },
        loadChildren: () => import('../../users/manage-profile/manage-profile.module').then(m => m.ManageProfileModule)
    },

    //retailer routing
    {
        path: 'retailer/manage-customers',
        data: {
            title: 'Retailer Manage Customers',
            roles: ['retailer'],
            permission: ['manage_retailer_customers']
        },
        loadChildren: () => import('../../retailer/manage-customer/manage-customer.module').then(m => m.ManageCustomerModule)
    },
    {
        path: 'retailer/gift-card',
        data: {
            title: 'Re Gift Card',
            roles: ['retailer'],
            permission: ['retailer_gift_card']
        },
        loadChildren: () => import('../../retailer/gift-card/gift-card.module').then(m => m.GiftCardModule)
    },
    {
        path: 'retailer/platinum-gift-card',
        data: {
            title: 'Re Gift Card',
            roles: ['retailer'],
            permission: ['retailer_platinum_gift_card']
        },
        loadChildren: () => import('../../retailer/platinum-gift-cards/platinum-gift-cards.module').then(m => m.PlatinumGiftCardsModule)
    },
    {
        path: 'retailer/gpr-card',
        data: {
            title: 'Retailer GPR Card',
            roles: ['retailer'],
            permission: ['retailer_gpr_card']
        },
        loadChildren: () => import('../../retailer/gpr-card/gpr-card.module').then(m => m.GprCardModule)
    },

    {
        path: 'retailer/transaction',
        data: {
            title: 'Retailer Transaction',
            roles: ['retailer'],
            permission: ['retailer_transaction']
        },
        loadChildren: () => import('../../retailer/my-transaction-request/my-transaction-request.module').then(m => m.MyTransactionRequestModule)
    },

    //customer routing
    {
        path: 'dashboard/customer',
        data: {
            title: 'Customer Dashboard',
            roles: ['customer'],
            permission: ['customer_dashboard']
        },
        loadChildren: () => import('../../customer/dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
        path: 'bill-payments',
        data: {
            title: 'Bill Payments',
            roles: ['admin', 'retailer', 'customer'],
            permission: ['bill_payments']
        },
        loadChildren: () => import('../../customer/bill-payments/bill-payments.module').then(m => m.BillPaymentsModule)
    },
    {
        path: 'gift-card',
        data: {
            title: 'Gift Card',
            roles: ['customer'],
            permission: ['gift_card']
        },
        loadChildren: () => import('../../customer/gift-card/gift-card.module').then(m => m.GiftCardModule)
    },
    {
        path: 'order-service',
        data: {
            title: 'Order Service',
            roles: ['customer'],
            permission: ['order_service']
        },
        loadChildren: () => import('../../customer/order-history/order-history.module').then(m => m.OrderHistoryModule)
    },


];
