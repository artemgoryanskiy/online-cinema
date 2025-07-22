import { Types } from 'mongoose';

export interface IAuthResponse {
  user: {
    _id: Types.ObjectId;
    email: string;
    isAdmin?: boolean;
  };
  refreshToken: string;
  accessToken: string;
}

export type TRole = 'admin' | 'user' | undefined;
