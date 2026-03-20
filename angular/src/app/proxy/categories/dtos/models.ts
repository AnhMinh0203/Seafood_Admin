
export interface CategoryDto {
  id: number;
  name?: string;
  productCount?: number;
}

export interface CreateCategoryDto {
  name?: string;
}

export interface UpdateCategoryDto {
  name?: string;
}
