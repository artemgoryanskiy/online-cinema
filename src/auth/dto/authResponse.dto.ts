import { UserResponseDto } from './userResponse.dto';

export interface AuthResponseDto {
  user: UserResponseDto;
  accessToken: string;
  refreshToken: string;
}
