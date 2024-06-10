import {MenuItem} from './menu.model';
import {Roles} from '../../shared/enums/roles';

export const MENU: MenuItem[] = [
    {
        label: 'Administration',
        isTitle: true,
        role: [Roles.admin]
    },
    {
        label: 'Analytics Dashboard',
        icon: 'ri-dashboard-2-line',
        link: '/dashboard/admin',
        role: [Roles.admin, Roles.sub_admin]
    },
    {
        label: 'Administration',
        icon: 'ri-admin-line',
        role: [Roles.admin],
        subItems: [
            {
                label: 'Master',
                link: '/admin/master',
            },
            {
                label: 'API Partner',
                link: '/admin/partner',
            },
            {
                label: 'Roles',
                link: '/admin/roles',
            },
            {
                label: 'Departments',
                link: '/department/department',
            },
            {
                label: 'Manage Wallets',
                link: '/admin/manage-wallets',
            },
            {
                label: 'Permissions' ,
                link: '/admin/permissions'
            },
            {
                label: 'Products',
                link: '/admin/manage-product'
            },
            {
                label: 'Company Banks',
                link: '/admin/manage-banks'
            },
            {
                label: 'Update FAQ',
                link: '/faq/list'
            },
        ]
    },

    {
        label: 'Manage Users',
        icon: 'ri-user-2-line',
        role: [Roles.admin, Roles.sub_admin],
        subItems: [
            {
                label: 'Manage Corporates',
                link: '/admin/manage-users/manage-corporates'
            },
            {
                label: 'Manage Customers',
                link: '/admin/manage-users/manage-customer'
            },
            {
                label: 'Manage Promote Request',
                link: '/promotion-request'
            },
            {
                label: 'Manage Map User',
                link: '/admin/manage-users/manage-map-user'
            },
            {
                label: 'Manage Sub-Admin User',
                link: 'admin/manage-users/manage-sub-admin'
            },
            {
                label: 'Manage Employee User',
                link: 'admin/manage-users/manage-employee'
            }
        ]
    },
    {
        label: 'Manage Balances',
        icon: 'ri-money-dollar-circle-line',
        role: [Roles.admin],
        subItems: [
            {
                label: 'Manage Pool Balance',
                link: '/manage-balance/pool-balance'
            }, {
                label: 'Downline Fund Request',
                link: '/manage-balance/my-downline-request'
            }
        ]
    },
    {
        label: 'Manage Gift Cards',
        icon: "ri-gift-2-line",
        role: [Roles.admin],
        subItems: [
            {
                label: 'Corporate Ledger',
                link: '/manage-gc/corporate-ledger'
            }, {
                label: 'Gift Cards',
                link: '/manage-gc/gift-cards'
            }
        ]
    },
    {
        label: 'Manual Refund',
        icon: 'ri-refund-2-line',
        role: [Roles.admin],
        link: 'admin/manual-refund'
    },
    {
        label: 'Manage Notifications',
        icon: 'ri-bank-card-line',
        role: [Roles.admin],
        subItems: [
            {
                label: 'Advertisements',
                link: '/manage-notifications/manage-advertisement'
            }, {
                label: 'Notifications',
                link: '/manage-notifications/manage-notification'
            }
        ]
    },
    {
        label: 'Manage Transactions',
        icon: 'ri-bank-card-line',
        role: [Roles.admin],
        subItems: [
            {
                label: 'Business Report',
                link: '/manage-transactions/business-report'
            }, {
                label: 'Pending Transactions',
                link: '/manage-transactions/pending-transactions'
            }
        ]
    },
    {
        label: 'Support Tickets',
        icon: 'ri-bank-card-line',
        role: [Roles.admin],
        link: '/manage-support-ticket'
    },
    {
        label: 'Reports',
        isTitle: true,
        role: [Roles.admin]
    },
    {
        label: 'Card Transaction',
        icon: 'ri-refund-line',
        role: [Roles.admin],
        subItems: [
            {
                label: 'Gift Card TopUp',
                link: 'card-transaction/gift-card-topup'
            },
            {
                label: 'Card Topup',
                link: 'card-transaction/card-topup'
            }, {
                label: 'Card to Card Transaction',
                link: '#',
                badge: {
                    variant: 'bg-success',
                    text: 'coming soon',
                },
            }, {
                label: 'Fee Adjustment',
                link: '#',
                badge: {
                    variant: 'bg-success',
                    text: 'coming soon',
                },
            }, {
                label: 'Transaction Adjustment',
                link: '#',
                badge: {
                    variant: 'bg-success',
                    text: 'coming soon',
                },
            }, {
                label: 'Manual Transaction',
                link: '#',
                badge: {
                    variant: 'bg-success',
                    text: 'coming soon',
                },
            }
        ]
    },
    {
        label: 'Pool Management',
        icon: 'ri-refund-line',
        role: [Roles.admin],
        subItems: [
            {
                label: 'Admin Wallet Daily Topup',
                link: 'pool-transaction/wallet-daily-topup'
            },
            {
                label: 'User Wise Wallet Daily Topup',
                link: 'pool-transaction/user-wise-wallet-daily-transaction',
                badge: {
                    variant: 'bg-success',
                    text: 'coming soon',
                },
            }
        ]
    },
    {
        label: 'Wallet Transaction',
        icon: 'ri-refund-line',
        role: [Roles.admin],
        subItems: [
            {
                label: 'Admin Wallet Topup',
                link: 'wallet-transaction/admin-wallet-topup/'
            },
            {
                label: 'User Wise Wallet Topup',
                link: 'wallet-transaction/user-wise-wallet-transaction',
            }
        ]
    },

    {
        label: 'Customer Service',
        icon: 'ri-refund-line',
        role: [Roles.admin],
        subItems: [
            {
                label: 'Manage Customer',
                link: '#',
                badge: {
                    variant: 'bg-success',
                    text: 'coming soon',
                },
            }, {
                label: 'Transaction Enquiry',
                link: '#',
                badge: {
                    variant: 'bg-success',
                    text: 'coming soon',
                },
            }, {
                label: 'Customer Details',
                link: '#',
                badge: {
                    variant: 'bg-success',
                    text: 'coming soon',
                },
            }, {
                label: 'Link Accounts',
                link: '#',
                badge: {
                    variant: 'bg-success',
                    text: 'coming soon',
                },
            }, {
                label: 'Manual Transaction',
                link: '#',
                badge: {
                    variant: 'bg-success',
                    text: 'coming soon',
                },
            }
        ]
    },
    {
        label: 'Card Generation',
        icon: 'ri-refund-line',
        role: [Roles.admin],
        subItems: [
            {
                label: 'Assign Card',
                link: '#',
                badge: {
                    variant: 'bg-success',
                    text: 'coming soon',
                },
            }, {
                label: 'Stock Card Generation',
                link: '#',
                badge: {
                    variant: 'bg-success',
                    text: 'coming soon',
                },
            }, {
                label: 'Stock Card Dispatch ',
                link: '#',
                badge: {
                    variant: 'bg-success',
                    text: 'coming soon',
                },
            }, {
                label: 'Card Renewal',
                link: '#',
                badge: {
                    variant: 'bg-success',
                    text: 'coming soon',
                },
            }
        ]
    },
    {
        label: 'Loyalty Management',
        icon: 'ri-refund-line',
        role: [Roles.admin],
        subItems: [
            {
                label: 'Create Plan',
                link: '#',
                badge: {
                    variant: 'bg-success',
                    text: 'coming soon',
                },
            }, {
                label: 'Reward Generation',
                link: '#',
                badge: {
                    variant: 'bg-success',
                    text: 'coming soon',
                },
            }, {
                label: 'Transaction Mapping',
                link: '#',
                badge: {
                    variant: 'bg-success',
                    text: 'coming soon',
                },
            }
        ]
    },
    {
        label: 'KYC Reports',
        icon: 'ri-refund-line',
        link: '#',
        role: [Roles.admin]
    },
    {
        label: 'PG Transactions',
        icon: 'ri-refund-line',
        link: '#',
        role: [Roles.admin]
    },

    {
        label: 'Charge Back',
        icon: 'ri-refund-line',
        link: '#',
        role: [Roles.admin]
    },
    {
        label: 'Dispute Transactions',
        icon: 'ri-refund-line',
        link: '#',
        role: [Roles.admin]
    },
    {
        label: 'Settlement File',
        icon: 'ri-refund-line',
        link: '#',
        role: [Roles.admin]
    },
    {
        label: 'Prefund Transaction',
        icon: 'ri-refund-line',
        link: '/',
        role: [Roles.admin]
    },
    {
        label: 'Balance Request',
        icon: 'ri-refund-line',
        link: '/',
        role: [Roles.admin]
    },

    {
        label: 'Retailer',
        isTitle: true,
        role: [Roles.retailer]
    },
    {
        label: 'Dashboard',
        icon: 'ri-dashboard-2-line',
        link: '/dashboard/retailer',
        role: [Roles.retailer]
    },
    {
        label: 'Manage Customer',
        icon: 'ri-user-line',
        role: [Roles.retailer],
        link: '/retailer/manage-customers',

    },

    {
        label: 'Manage Gift Cards',
        icon: 'ri-gift-2-line',
        role: [Roles.retailer],
        link: '/retailer/gift-card'

    },
    {
        label: 'Manage GPR Cards',
        icon: 'ri-bank-card-2-line',
        role: [Roles.retailer],
        link: '/retailer/gpr-card'
    },

    {
        label: 'My Fund Request',
        icon: 'mdi mdi-hand-back-left-outline',
        link: '/manage-balance/my-fund-request',
        role: [Roles.retailer]
    },
    {
        label: 'Transaction History',
        icon: 'mdi mdi-bank-transfer',
        link: '/retailer/transaction',
        role: [Roles.retailer]
    },
    {
        label: 'Customer',
        isTitle: true,
        role: [Roles.customer]
    },
    {
        label: 'Dashboard',
        icon: 'ri-dashboard-2-line',
        link: 'dashboard/customer',
        role: [Roles.customer]
    },
    {
        label: 'Manage Gift Cards',
        icon: 'ri-bank-card-line',
        link: '/gift-card/manage-gc',
        role: [Roles.customer]
    },
    {
        label: 'Bill Payments',
        icon: 'ri-bill-line',
        role: [Roles.customer],
        link: '/bill-payments'
    },
    {
        label: 'Card Transaction',
        icon: 'ri-bank-card-line',
        role: [Roles.customer],
        link: '/manage-balance/pg-transaction'
    },
    {
        label: 'Order History',
        icon: 'ri-wallet-line',
        role: [Roles.customer],
        link: '/order-service'
    },
    {
        label: 'Offers & Rewards',
        icon: 'ri-star-smile-line',
        role: [Roles.customer],
        link: '/admin/support-tickets',
        badge: {
            variant: 'bg-success',
            text: 'coming soon',
        },
    },

    {
        label: 'Comming Soon',
        role: [Roles.customer],
        isTitle: true
    },
    {
        label: 'Ru-Investments',
        icon: 'ri-star-smile-line',
        role: [Roles.customer],
        badge: {
            variant: 'bg-success',
            text: 'coming soon',
        },
    },
    {
        label: 'Ru-Credits',
        icon: 'ri-star-smile-line',
        role: [Roles.customer],
        badge: {
            variant: 'bg-success',
            text: 'coming soon',
        },
    },
    {
        label: 'Ru-Forex',
        icon: 'ri-star-smile-line',
        role: [Roles.customer],
        badge: {
            variant: 'bg-success',
            text: 'coming soon',
        },
    },
    {
        label: 'Help',
        isTitle: true
    },
    {
        label: 'Raise Tickets',
        icon: 'ri-bank-card-line',
        role: [Roles.customer],
        link: '/manage-support-ticket'
    },
    {
        label: 'FAQ',
        icon: 'ri-question-answer-line',
        link: '/faq'
    },
    {
        label: 'Contact Us',
        icon: 'ri-contacts-book-line',
        role: [Roles.customer],
        link: '/manage-support-ticket',
        badge: {
            variant: 'bg-success',
            text: 'coming soon',
        },
    },


];
