export interface MenuPageVm {
  categories: MenuCategoryVm[];
}

export interface MenuCategoryVm {
  key: string;
  name: string;
  subLabel: string | null;
  icon: string | null;
  sortOrder: number;
  products: MenuProductVm[];
}

export interface MenuProductVm {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  slug: string;
  categoryKey: string;
}