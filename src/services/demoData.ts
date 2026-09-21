import type { Category, Product } from '../types';

export const DEMO_RESTAURANT = {
  name: 'emynfc',
  tagline: 'Restaurant - Fast Food',
  description: 'Modern restaurant where flavors meet fire.',
  phone: '+212 638 571 166',
  whatsapp: '+212638571166',
  email: 'youssefelamyn890@gmail.com',
  address: 'Inzegani Tarasst',
  city: 'Inzegani',
  hours: 'Mon - Sun - 11:00 - 23:30',
  heroImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
  social: {
    instagram: 'https://instagram.com/emynfc',
    facebook: 'https://facebook.com/emynfc',
    tiktok: 'https://tiktok.com/@emynfc',
  },
};

export const CATEGORIES: Category[] = [
  { id: 'burgers', name: 'Burgers', nameAr: 'Burgers', nameFr: 'Burgers', icon: 'B', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80' },
  { id: 'tacos', name: 'Tacos', nameAr: 'Tacos', nameFr: 'Tacos', icon: 'T', image: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=600&q=80' },
  { id: 'pizza', name: 'Pizza', nameAr: 'Pizza', nameFr: 'Pizza', icon: 'P', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&q=80' },
  { id: 'moroccan', name: 'Moroccan', nameAr: 'Moroccan', nameFr: 'Marocain', icon: 'M', image: 'https://images.unsplash.com/photo-1544378730-8b5104b18790?w=600&q=80' },
  { id: 'desserts', name: 'Desserts', nameAr: 'Desserts', nameFr: 'Desserts', icon: 'D', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80' },
  { id: 'drinks', name: 'Drinks', nameAr: 'Drinks', nameFr: 'Boissons', icon: 'K', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80' },
];

export const PRODUCTS: Product[] = [
  { id: 'royal-burger', name: 'Royal Burger', nameAr: 'Royal Burger', nameFr: 'Royal Burger', description: 'Double beef patty, cheddar, caramelized onion.', price: 65, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', categoryId: 'burgers', rating: 4.9, popular: true },
  { id: 'smash-burger', name: 'Smash Burger', nameAr: 'Smash Burger', nameFr: 'Smash Burger', description: 'Crispy smashed patty, cheese, pickles.', price: 50, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80', categoryId: 'burgers', rating: 4.8, popular: true },
  { id: 'chicken-tacos', name: 'Chicken Tacos', nameAr: 'Chicken Tacos', nameFr: 'Tacos Poulet', description: 'Grilled chicken, avocado, cilantro.', price: 45, image: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=800&q=80', categoryId: 'tacos', rating: 4.7 },
  { id: 'beef-tacos', name: 'Beef Tacos', nameAr: 'Beef Tacos', nameFr: 'Tacos Boeuf', description: 'Slow-cooked beef, salsa, cheese.', price: 50, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80', categoryId: 'tacos', rating: 4.8 },
  { id: 'margherita', name: 'Margherita Pizza', nameAr: 'Margherita', nameFr: 'Margherita', description: 'Tomato, mozzarella, basil.', price: 55, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&q=80', categoryId: 'pizza', rating: 4.6 },
  { id: 'pepperoni', name: 'Pepperoni Pizza', nameAr: 'Pepperoni', nameFr: 'Pepperoni', description: 'Double pepperoni, mozzarella.', price: 65, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80', categoryId: 'pizza', rating: 4.8, popular: true },
  { id: 'moroccan-tagine', name: 'Moroccan Tagine', nameAr: 'Tagine', nameFr: 'Tajine', description: 'Lamb, prunes, almonds.', price: 80, image: 'https://images.unsplash.com/photo-1544378730-8b5104b18790?w=800&q=80', categoryId: 'moroccan', rating: 4.9, popular: true },
  { id: 'chicken-pastilla', name: 'Chicken Pastilla', nameAr: 'Pastilla', nameFr: 'Pastilla', description: 'Spiced chicken, almond.', price: 65, image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&q=80', categoryId: 'moroccan', rating: 4.7 },
  { id: 'french-fries', name: 'French Fries', nameAr: 'Fries', nameFr: 'Frites', description: 'Hand-cut, sea salt.', price: 25, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80', categoryId: 'desserts', rating: 4.5 },
  { id: 'tiramisu', name: 'Tiramisu', nameAr: 'Tiramisu', nameFr: 'Tiramisu', description: 'Espresso, mascarpone.', price: 35, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80', categoryId: 'desserts', rating: 4.9 },
  { id: 'cheesecake', name: 'Cheesecake', nameAr: 'Cheesecake', nameFr: 'Cheesecake', description: 'Berry compote.', price: 35, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80', categoryId: 'desserts', rating: 4.7 },
  { id: 'orange-juice', name: 'Orange Juice', nameAr: 'Orange', nameFr: 'Jus', description: 'Fresh squeezed.', price: 20, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80', categoryId: 'drinks', rating: 4.8 },
  { id: 'cola', name: 'Coca Cola', nameAr: 'Cola', nameFr: 'Cola', description: 'Ice-cold.', price: 15, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80', categoryId: 'drinks', rating: 4.6 },
  { id: 'mojito', name: 'Mojito', nameAr: 'Mojito', nameFr: 'Mojito', description: 'Mint, lime, soda.', price: 30, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80', categoryId: 'drinks', rating: 4.8 },
];
