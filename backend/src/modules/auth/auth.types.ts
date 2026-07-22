export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthenticatedUserDto {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

export interface LoginResponseDto {
  accessToken: string;
  user: AuthenticatedUserDto;
}
