import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Genre {
  _id: Types.ObjectId;

  @Prop()
  name: string;
  @Prop({ unique: true })
  slug: string;
  @Prop()
  description: string;
  @Prop()
  icon: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
