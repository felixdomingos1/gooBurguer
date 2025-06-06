export type BurgerCategory = 'CLASSIC' | 'PREMIUM' | 'VEGETARIAN' | 'VEGAN' | 'SIGNATURE';

export interface BurgerIngredient {
  name: string;
  isRemovable: boolean;
  isExtra?: boolean;
  extraPrice?: number;
}

export interface Burger {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  image: string;
  images: string[]; // Stored as JSON in DB
  category: BurgerCategory;
  ingredients: BurgerIngredient[]; // Stored as JSON in DB
  preparationTime: number;
  calories?: number | null;
  isAvailable: boolean;
  isFeatured: boolean;
  isNew: boolean;
  ratingAverage?: number;
  ratingCount?: number;
  tags: string[]; // Stored as JSON in DB
  createdAt: Date | string;
  updatedAt: Date | string;
  reviews?: BurgerReview[]; // Optional: you might or might not include this
}

export interface BurgerReview {
  id: string;
  burgerId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date | string;
}

export interface BurgerListResponse {
  page: number;
  results: Burger[];
  totalPages: number;
  totalResults: number;
  categories: BurgerCategory[];
}
