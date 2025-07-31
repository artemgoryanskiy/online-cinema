import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from './movie.schema';
import { Model, Types } from 'mongoose';
import { CreateMovieDto } from './create-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
  ) {}

  async bySlug(slug: string) {
    const movie = await this.movieModel
      .findOne({ slug })
      .populate('actors genres')
      .exec();
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  async byActor(actorId: Types.ObjectId) {
    const movies = await this.movieModel.find({ actors: actorId }).exec();
    if (!movies) throw new NotFoundException('Movies not found');
    return movies;
  }

  async byGenres(genreIds: Types.ObjectId[]) {
    const movies = await this.movieModel
      .find({ genres: { $in: genreIds } })
      .exec();
    if (!movies) throw new NotFoundException('Movies not found');
    return movies;
  }

  async getMostPopular() {
    return await this.movieModel
      .find({ countOpened: { $gt: 0 } })
      .sort({ countOpened: -1 })
      .populate('genres')
      .exec();
  }

  async updateCountOpened(slug: string) {
    const updatedMovie = await this.movieModel
      .findOneAndUpdate({ slug }, { $inc: { countOpened: 1 } })
      .exec();
    if (!updatedMovie) throw new NotFoundException('Movie not found');
    return updatedMovie;
  }

  async getMovies(searchTerm?: string) {
    let options = {};
    if (searchTerm) {
      options = {
        $or: [{ title: new RegExp(searchTerm, 'i') }],
      };
    }
    return await this.movieModel
      .find(options)
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .populate('actors genres')
      .exec();
  }

  async byId(_id: string) {
    const movie = await this.movieModel.findById(_id).exec();
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  async createMovie() {
    const defaultValues: CreateMovieDto = {
      bigPoster: '',
      actors: [],
      genres: [],
      poster: '',
      title: '',
      videoUrl: '',
      slug: '',
    };
    const movie = await this.movieModel.create(defaultValues);
    return movie._id;
  }

  async updateMovie(_id: string, dto: CreateMovieDto) {
    const updatedMovie = await this.movieModel
      .findByIdAndUpdate(_id, dto, {
        new: true,
      })
      .exec();
    if (!updatedMovie) throw new NotFoundException('Movie not found');
    return updatedMovie;
  }

  async deleteMovie(id: string) {
    const deletedMovie = await this.movieModel.findById(id).exec();
    if (!deletedMovie) throw new NotFoundException('Movie not found');
    return deletedMovie;
  }
}
