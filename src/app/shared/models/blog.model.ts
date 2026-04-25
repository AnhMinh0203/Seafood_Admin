// export interface Blog {
//   id: number;
//   title: string;
//   coverImage: string;
//   content: string;
//   view: number;
//   creationTime: string;
//   creatorId?: string | null;
//   creatorName: string;
// }

export interface BlogDto {
  id: number;
  title: string;
  coverImage: string;
  summary: string;
  content: string;
  view: number;
  creationTime: string;
  creatorId?: string | null;
  creatorName: string;
}


export interface BlogListDto {
  id: number;
  title?: string;
  summary?:string;
  coverImage?: string;
  view:number;
  creationTime?: string;
}