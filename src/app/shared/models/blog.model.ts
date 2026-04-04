export interface Blog {
  id: number;
  title: string;
  coverImage: string;
  content: string;
  view: number;
  creationTime: string;
  creatorId?: string | null;
  creatorName: string;
}