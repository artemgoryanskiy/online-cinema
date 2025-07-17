import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../user/user.schema';
import { Model } from 'mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';

interface JwtPayload {
  _id: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret',
    };
    super(options);
  }

  async validate(payload: JwtPayload): Promise<UserDocument> {
    const user = await this.userModel.findById(payload._id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
