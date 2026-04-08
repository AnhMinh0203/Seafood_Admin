export interface ProductCardVm {
  id: string;
  name: string;
  image: string;
  price: number;
  weight: string;
  isFavorite: boolean;
  origin?: string;
  slug?: string;
}