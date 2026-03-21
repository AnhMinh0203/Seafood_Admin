
export interface BlogDto {
  id: number;
  title?: string;
  coverImage?: string;
  content?: string;
  creationTime?: string;
}

export interface CreateBlogDto {
  title?: string;
  coverImage: File | null;
  content?: string;
}

export interface UpdateBlogDto {
  title?: string;
  coverImage: File | null;
  content?: string;
}
