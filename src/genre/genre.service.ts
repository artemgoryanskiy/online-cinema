import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Genre } from './genre.schema';
import { Model } from 'mongoose';
import { CreateGenreDto } from './dto/createGenre.dto';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name) private readonly genreModel: Model<Genre>,
  ) {}

  async bySlug(slug: string) {
    return this.genreModel.findOne({ slug }).exec();
  }

  async getGenres(searchTerm?: string) {
    let options = {};
    if (searchTerm) {
      options = {
        $or: [
          { name: new RegExp(searchTerm, 'i') },
          { slug: new RegExp(searchTerm, 'i') },
          { description: new RegExp(searchTerm, 'i') },
        ],
      };
    }
    return this.genreModel
      .find(options)
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .exec();
  }

  async getCollections() {
    const genres = await this.getGenres();
    const collections = genres;
    return collections;
  }

  // Admin
  async byId(_id: string) {
    const genre = await this.genreModel.findById(_id);
    if (!genre) throw new NotFoundException('Genre not found');
    return genre;
  }

  async createGenre() {
    const defaultValues: CreateGenreDto = {
      name: '',
      slug: '',
      description: '',
      icon: '',
    };
    const genre = await this.genreModel.create(defaultValues);
    return genre._id;
  }

  async updateGenre(_id: string, dto: CreateGenreDto) {
    return this.genreModel.findByIdAndUpdate(_id, dto, { new: true }).exec();
  }

  async deleteGenre(id: string) {
    return this.genreModel.findByIdAndDelete(id).exec();
  }
}
