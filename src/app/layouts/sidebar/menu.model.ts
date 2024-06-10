

export interface MenuItem {
    label?: any;
    icon?: string;
    link?: string;
    subItems?: MenuItem[];
    isTitle?: boolean;
    badge?: any;
    parentId?: number;
    disabled?:boolean;
    isLayout?: boolean;
    role?: string[];
}