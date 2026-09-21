export type Locale = 'en' | 'fr' | 'ar';

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  icon: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  rating: number;
  popular?: boolean;
}

export interface CartLine {
  product: Product;
  quantity: number;
}
