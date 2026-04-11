export interface ToggleFavoriteResultDto {
  isFavorite: boolean;
  message: string;
}

export interface FavoriteProductDto {
  productId: string;
  name: string;
  coverImage?: string | null;
  origin?: string | null;
  slug?: string | null;
  unit: string;
  price: number;
}

export interface FavoriteProductVm {
  productId: string;
  name: string;
  coverImage?: string | null;
  origin?: string | null;
  slug?: string | null;
  unit: string;
  price: number;
}

export interface ToggleFavoriteResultVm {
  isFavorite: boolean;
  message: string;
}