export interface RecipeSummary {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  image: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Dessert' | 'Drink';
  cuisine: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  preparationTime: number;
  cookingTime: number;
  calories: number;
  dietaryTags: string[];
  averageRating: number;
  reviewCount: number;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit?: string;
}

export interface Recipe extends RecipeSummary {
  fullDescription: string;
  galleryImages: string[];
  servings: number;
  priceEstimate: number;
  ingredients: Ingredient[];
  instructions: string[];
  createdBy: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewAuthor {
  _id: string;
  name: string;
  photoURL?: string;
}

export interface Review {
  _id: string;
  userId: ReviewAuthor;
  recipeId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RecipeListResponse {
  data: RecipeSummary[];
  meta: PaginationMeta;
}

export interface ReviewListResponse {
  data: Review[];
  meta: PaginationMeta;
}
