
export interface BlogDto {
  id: number;
  title?: string;
  summary?:string;
  view:number;
  coverImage?: string;
  content?: string;
  creationTime?: string;
}

export interface CreateBlogDto {
  title?: string;
  summary?:string;
  coverImage: File | null;
  content?: string;
}

export interface UpdateBlogDto {
  title?: string;
  summary?:string;
  coverImage: File | null;
  content?: string;
}

export interface BlogListDto {
  id: number;
  title?: string;
  summary?:string;
  coverImage?: string;
  view:number;
  creationTime?: string;
}
