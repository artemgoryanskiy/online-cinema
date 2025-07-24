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
import { GenreService } from './genre.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateGenreDto } from './dto/createGenre.dto';
import { IdValidationPipe } from '../pipes/id.validation.pipe';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.genreService.bySlug(slug);
  }

  @Get('collections')
  async getCollections() {
    return this.genreService.getCollections();
  }

  @Get()
  async getGenres(@Query('searchTerm') searchTerm?: string) {
    return this.genreService.getGenres(searchTerm);
  }

  @Post()
  @Auth('admin')
  async createGenre() {
    return this.genreService.createGenre();
  }

  @Get(':id')
  @Auth('admin')
  async byId(@Param('id', IdValidationPipe) id: string) {
    return this.genreService.byId(id);
  }

  @UsePipes(new IdValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateGenre(
    @Body() dto: CreateGenreDto,
    @Param('id', IdValidationPipe) _id: string,
  ) {
    return this.genreService.updateGenre(_id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteGenre(@Param('id', IdValidationPipe) id: string) {
    return this.genreService.deleteGenre(id);
  }
}
