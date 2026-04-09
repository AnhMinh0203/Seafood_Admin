export interface RegisterDto {
  userName: string;
  password: string;
  phoneNumber: string;
  fullName: string;
}

export interface LoginDto {
  userName: string;
  password: string;
}

export interface RegisterResponseDto {
  id: string;
  userName: string;
  phoneNumber: string;
  fullName: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken?: string;
}