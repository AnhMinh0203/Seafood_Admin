export interface BaseResponse<T> {
  isSuccess: boolean;
  status: number;
  message: string;
  data: T;
}

export interface PagedResultDto<T> {
  totalCount: number;
  items: T[];
}

export interface PagedAndSortedResultRequestDto {
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
}