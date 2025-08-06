import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Actor, ActorDocument } from './actor.schema';
import { Model, Types } from 'mongoose';
import { ActorDto } from './actor.dto';

@Injectable()
export class ActorService {
  constructor(
    @InjectModel(Actor.name) private readonly actorModel: Model<Actor>,
  ) {}

  async bySlug(slug: string): Promise<ActorDocument> {
    const actor = await this.actorModel.findOne({ slug }).exec();
    if (!actor) throw new NotFoundException('Actor not found');
    return actor;
  }

  async getActors(searchTerm?: string): Promise<any[]> {
    let options = {};
    if (searchTerm) {
      options = {
        $or: [
          { name: new RegExp(searchTerm, 'i') },
          { slug: new RegExp(searchTerm, 'i') },
        ],
      };
    }
    return this.actorModel
      .aggregate()
      .match(options)
      .lookup({
        from: 'movies',
        localField: '_id',
        foreignField: 'actors',
        as: 'movies',
      })
      .addFields({
        countMovies: { $size: '$movies' },
      })
      .project({ __v: 0, movies: 0, updatedAt: 0 })
      .sort({ createdAt: -1 })
      .exec();
  }

  async byId(_id: string): Promise<ActorDocument> {
    const actor = await this.actorModel.findById(_id).exec();
    if (!actor) throw new NotFoundException('Actor not found');
    return actor;
  }

  async createActor(): Promise<Types.ObjectId> {
    const defaultValues: ActorDto = {
      name: '',
      slug: '',
      photo: '',
    };
    const actor = await this.actorModel.create(defaultValues);
    return actor._id;
  }

  async updateActor(_id: string, dto: ActorDto): Promise<ActorDocument> {
    const updatedActor = await this.actorModel
      .findByIdAndUpdate(_id, dto, {
        new: true,
      })
      .exec();
    if (!updatedActor) throw new NotFoundException('Actor not found');
    return updatedActor;
  }

  async deleteActor(id: string): Promise<ActorDocument> {
    const deletedActor = await this.actorModel.findById(id).exec();
    if (!deletedActor) throw new NotFoundException('Actor not found');
    return deletedActor;
  }
}
