import { Injectable } from '@nestjs/common';
import { Rating, RatingDocument } from './rating.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MovieService } from '../movie/movie.service';
import { SetRatingDto } from './dto/set-rating.dto';

interface AveragedRatingResult {
  _id: Types.ObjectId;
  averageRating: number;
}

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private readonly ratingModel: Model<Rating>,
    private readonly movieService: MovieService,
  ) {}

  async getMovieValueByUser(movieId: Types.ObjectId, userId: Types.ObjectId) {
    return this.ratingModel
      .findOne({ movie: movieId, user: userId })
      .select('value')
      .exec()
      .then((rating) => rating?.value || 0);
  }

  async averageRatingByMovie(
    movieId: Types.ObjectId | string,
  ): Promise<AveragedRatingResult[]> {
    const AVERAGE_RATING_FIELD = 'averageRating';
    const normalizedMovieId = new Types.ObjectId(movieId);

    const matchStage = { $match: { movie: normalizedMovieId } };
    const groupStage = {
      $group: {
        _id: '$movie',
        [AVERAGE_RATING_FIELD]: { $avg: '$value' },
      },
    };

    return await this.ratingModel
      .aggregate<AveragedRatingResult>([matchStage, groupStage])
      .exec();
  }

  async setRating(
    userId: Types.ObjectId,
    dto: SetRatingDto,
  ): Promise<RatingDocument> {
    const { movieId, value } = dto;
    const newRating = this.ratingModel
      .findOneAndUpdate(
        { movie: movieId, user: userId },
        { value },
        {
          upsert: true,
          setDefaultsOnInsert: true,
          new: true,
        },
      )
      .exec();

    await this.movieService.updateRating(movieId, value);

    return newRating;
  }
}
