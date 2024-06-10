export interface ProductList {
    id: string;
    product_image: string;
    product_name: string;
    product_code: string;
    product_type: string;
    branding_category: string;
    service_provider: string;
    product_description: null
    created_user: { username: string }
    product_series: string;    active: boolean;
    created_at: string;
    wallet_id: number;
    partners_id: number;
}