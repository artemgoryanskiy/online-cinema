import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ActorService } from './actor.service';
import { IdValidationPipe } from '../pipes/id.validation.pipe';
import { Auth } from '../auth/decorators/auth.decorator';
import { ActorDto } from './actor.dto';

@Controller('actor')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.actorService.bySlug(slug);
  }

  @Get()
  async getActors(@Query('searchTerm') searchTerm: string) {
    return this.actorService.getActors(searchTerm);
  }

  @Get(':id')
  @Auth('admin')
  async byId(@Param('id', IdValidationPipe) id: string) {
    return this.actorService.byId(id);
  }

  @UsePipes(new IdValidationPipe())
  @Post()
  @Auth('admin')
  @HttpCode(200)
  async createActor() {
    return this.actorService.createActor();
  }

  @UsePipes(new IdValidationPipe())
  @Put(':id')
  @Auth('admin')
  @HttpCode(200)
  async updateActor(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: ActorDto,
  ) {
    return this.actorService.updateActor(id, dto);
  }

  @Delete(':id')
  @Auth('admin')
  @HttpCode(200)
  async deleteActor(@Param('id', IdValidationPipe) id: string) {
    return this.actorService.deleteActor(id);
  }
}
