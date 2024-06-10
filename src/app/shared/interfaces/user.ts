interface Wallet {
    name?: string;
    balance?: number;
}

export interface User {
    id?: string;
    wallets?: Wallet[];
    name?: string;
    mobile?: string;
    photo?: string;
    role?: string;
    token?: string;
    verified?: boolean;
}
