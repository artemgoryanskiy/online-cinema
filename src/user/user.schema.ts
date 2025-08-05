import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  isAdmin?: boolean;

  @Prop({ default: [], type: [{ type: Types.ObjectId, ref: 'Movie' }] })
  favorites?: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
