import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/updateUser.dto';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async byId(_id: string) {
    const user = await this.userModel.findById(_id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(_id: string, dto: UpdateUserDto) {
    const user = await this.byId(_id);
    const isSameUser = await this.userModel.findOne({ email: dto.email });
    if (isSameUser && String(_id) !== String(isSameUser._id))
      throw new NotFoundException('User with this email already exists');

    if (dto.password) {
      const salt = await genSalt();
      user.password = await hash(dto.password, salt);
    }

    user.email = dto.email;
    if (dto.isAdmin || dto.isAdmin === false) user.isAdmin = dto.isAdmin;
    await user.save();
    return user;
  }

  async getUserCount() {
    return await this.userModel.find().countDocuments().exec();
  }

  async getUsers(searchTerm?: string) {
    let options = {};
    if (searchTerm) {
      options = {
        $or: [{ email: new RegExp(searchTerm, 'i') }],
      };
    }
    return this.userModel
      .find(options)
      .select('-password -updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .exec();
  }

  async deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
