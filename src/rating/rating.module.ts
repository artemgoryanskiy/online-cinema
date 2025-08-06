import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rating, RatingSchema } from './rating.schema';
import { MovieModule } from '../movie/movie.module';

@Module({
  controllers: [RatingController],
  imports: [
    MongooseModule.forFeature([
      {
        name: Rating.name,
        schema: RatingSchema,
      },
    ]),
    MovieModule,
  ],
  providers: [RatingService],
})
export class RatingModule {}
