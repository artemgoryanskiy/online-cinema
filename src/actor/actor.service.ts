import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Actor } from './actor.schema';
import { Model } from 'mongoose';
import { ActorDto } from './actor.dto';

@Injectable()
export class ActorService {
  constructor(
    @InjectModel(Actor.name) private readonly actorModel: Model<Actor>,
  ) {}

  async bySlug(slug: string) {
    const actor = await this.actorModel.findOne({ slug }).exec();
    if (!actor) throw new NotFoundException('Actor not found');
    return actor;
  }

  async getActors(searchTerm?: string) {
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
      .find(options)
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .exec();
  }

  async byId(_id: string) {
    const actor = await this.actorModel.findById(_id).exec();
    if (!actor) throw new NotFoundException('Actor not found');
    return actor;
  }

  async createActor() {
    const defaultValues: ActorDto = {
      name: '',
      slug: '',
      photo: '',
    };
    const actor = await this.actorModel.create(defaultValues);
    return actor._id;
  }

  async updateActor(_id: string, dto: ActorDto) {
    const updatedActor = await this.actorModel
      .findByIdAndUpdate(_id, dto, {
        new: true,
      })
      .exec();
    if (!updatedActor) throw new NotFoundException('Actor not found');
    return updatedActor;
  }

  async deleteActor(id: string) {
    const deletedActor = await this.actorModel.findById(id).exec();
    if (!deletedActor) throw new NotFoundException('Actor not found');
    return deletedActor;
  }
}
