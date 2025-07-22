import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthDto } from './dto/auth.dto';
import { hash, genSalt, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

interface AuthResponse {
  user: {
    _id: Types.ObjectId;
    email: string;
    isAdmin?: boolean;
  };
  refreshToken: string;
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: AuthDto) {
    const oldUser = await this.userModel.findOne({ email: dto.email });
    if (oldUser) throw new UnauthorizedException('User already exists');
    const salt = await genSalt();
    const newUser = new this.userModel({
      email: dto.email,
      password: await hash(dto.password, salt),
    });
    const tokens = await this.issueTokenPair(String(newUser._id));
    return {
      user: this.returnUserFields(newUser),
      ...tokens,
    };
  }

  async login(dto: AuthDto): Promise<AuthResponse> {
    const user = await this.validateUser(dto);
    const tokens = await this.issueTokenPair(String(user._id));
    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async validateUser(dto: AuthDto): Promise<User> {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new UnauthorizedException('User not found');
    const isMatch = await compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid password');
    return user;
  }

  async issueTokenPair(userId: string) {
    const data = { userId };
    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '15d',
    });
    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '15m',
    });
    return {
      refreshToken,
      accessToken,
    };
  }

  returnUserFields(user: User) {
    return {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }
}
