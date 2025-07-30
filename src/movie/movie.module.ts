import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './movie.schema';

@Module({
  controllers: [MovieController],
  imports: [
    MongooseModule.forFeature([
      {
        name: Movie.name,
        schema: MovieSchema,
      },
    ]),
  ],
  providers: [MovieController],
})
export class MovieModule {}
