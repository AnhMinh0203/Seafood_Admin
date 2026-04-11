export interface ProductCardVm {
  id: string;
  name: string;
  origin: string;
  coverImage: string;
  slug: string;
  defaultPrice?: number;
  defaultUnitName?: string;
  isFavorite?: boolean;

}