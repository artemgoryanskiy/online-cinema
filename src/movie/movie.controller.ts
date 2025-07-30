import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { IdValidationPipe } from '../pipes/id.validation.pipe';
import { Types } from 'mongoose';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateMovieDto } from './create-movie.dto';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.movieService.bySlug(slug);
  }

  @Get('by-actor/:actorId')
  async byActor(@Param('actorId', IdValidationPipe) actorId: Types.ObjectId) {
    return this.movieService.byActor(actorId);
  }

  @Post('by-genres')
  @HttpCode(200)
  async byGenres(@Body('genreIds') genreIds: Types.ObjectId[]) {
    return this.movieService.byGenres(genreIds);
  }

  @Get('most-popular')
  async getMostPopular() {
    return this.movieService.getMostPopular();
  }

  @Get()
  async getMovies(@Query('searchTerm') searchTerm?: string) {
    return this.movieService.getMovies(searchTerm);
  }

  @Post('count-opened')
  @HttpCode(200)
  async updateCountOpened(@Body('slug') slug: string) {
    return this.movieService.updateCountOpened(slug);
  }

  @Get(':id')
  @Auth('admin')
  async byId(@Param('id', IdValidationPipe) _id: string) {
    return this.movieService.byId(_id);
  }

  @UsePipes(new IdValidationPipe())
  @Post()
  @Auth('admin')
  @HttpCode(200)
  async createMovie() {
    return this.movieService.createMovie();
  }

  @UsePipes(new IdValidationPipe())
  @Post(':id')
  @Auth('admin')
  @HttpCode(200)
  async updateMovie(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateMovieDto,
  ) {
    return this.movieService.updateMovie(id, dto);
  }

  @Delete(':id')
  @Auth('admin')
  @HttpCode(200)
  async deleteMovie(@Param('id', IdValidationPipe) id: string) {
    return this.movieService.deleteMovie(id);
  }
}
