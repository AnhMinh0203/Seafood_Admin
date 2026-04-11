export interface RegisterDto {
  userName: string;
  password: string;
  phoneNumber: string;
  fullName: string;
}

export interface RegisterResponseDto {
  id: string;
  userName: string;
  phoneNumber: string;
  fullName: string;
}

export interface LoginDto {
  userNameOrPhoneNumber: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponseDto {
  id: string;
  userName: string;
  phoneNumber: string;
  fullName: string;
}