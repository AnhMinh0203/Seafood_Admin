export interface BaseResponse<T> {
  isSuccess: boolean;
  status: number;
  message: string;
  data: T;
}
