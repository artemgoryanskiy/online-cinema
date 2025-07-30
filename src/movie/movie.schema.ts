import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Genre } from '../genre/genre.schema';
import { Actor } from '../actor/actor.schema';

@Schema({ timestamps: true })
export class Parameters {
  _id: Types.ObjectId;

  @Prop()
  year: number;

  @Prop()
  duration: number;

  @Prop()
  country: string;
}

@Schema({ timestamps: true })
export class Movie {
  _id: Types.ObjectId;

  @Prop()
  poster: string;

  @Prop()
  bigPoster: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ unique: true })
  slug: string;

  @Prop()
  parameters?: Parameters;

  @Prop({ default: 4.0 })
  rating?: number;

  @Prop({ default: 0 })
  countOpened?: number;

  @Prop()
  videoUrl: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' })
  genres: Genre[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' })
  actors: Actor[];

  @Prop({ default: false })
  isSendTelegram?: boolean;
}

export const ParametersSchema = SchemaFactory.createForClass(Parameters);
export const MovieSchema = SchemaFactory.createForClass(Movie);
