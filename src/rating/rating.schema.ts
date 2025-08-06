import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Rating {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Movie' })
  movie: Types.ObjectId;

  @Prop()
  value: number;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
export type RatingDocument = HydratedDocument<Rating>;
