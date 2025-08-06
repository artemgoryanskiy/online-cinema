import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { Types } from 'mongoose';
import { Auth } from '../auth/decorators/auth.decorator';
import { IdValidationPipe } from '../pipes/id.validation.pipe';
import { CurrentUser } from '../user/decorators/user.decorator';
import { SetRatingDto } from './dto/set-rating.dto';
import { RatingDocument } from './rating.schema';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get(':movieId')
  @Auth()
  async getMovieValueByUser(
    @Param('movieId', IdValidationPipe) movieId: Types.ObjectId,
    @CurrentUser('_id') _id: Types.ObjectId,
    userId: Types.ObjectId,
  ) {
    return this.ratingService.getMovieValueByUser(movieId, userId);
  }

  @UsePipes(new IdValidationPipe())
  @Post('set-rating')
  @HttpCode(200)
  @Auth()
  async setRating(
    @CurrentUser('_id') _id: Types.ObjectId,
    @Body() dto: SetRatingDto,
  ): Promise<RatingDocument> {
    return this.ratingService.setRating(_id, dto);
  }
}
