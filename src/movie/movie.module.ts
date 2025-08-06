import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './movie.schema';
import { MovieService } from './movie.service';

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
  providers: [MovieService],
  exports: [MovieService],
})
export class MovieModule {}
