import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/user.schema';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';
import { hash, genSalt, compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from './dto/authResponse.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: AuthDto): Promise<AuthResponseDto> {
    const oldUser = await this.userModel.findOne({ email: dto.email });
    if (oldUser) {
      throw new BadRequestException('User already exists');
    }

    const salt = await genSalt(10);
    const newUser = new this.userModel({
      email: dto.email,
      password: await hash(dto.password, salt),
    });

    const savedUser = await newUser.save();

    const tokenPair = await this.issueTokenPair(String(savedUser._id));

    return {
      user: this.returnUserFields(savedUser),
      ...tokenPair,
    };
  }

  async login(dto: AuthDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(dto);
    const tokenPair = await this.issueTokenPair(String(user._id));

    return {
      user: this.returnUserFields(user),
      ...tokenPair,
    };
  }

  async validateUser(dto: AuthDto): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isMatch = await compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }
  async issueTokenPair(userId: string) {
    const payload = { _id: userId };
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15d',
    });

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
    return {
      refreshToken,
      accessToken,
    };
  }

  returnUserFields(user: UserDocument) {
    return {
      _id: user._id?.toString() || '',
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }
}
