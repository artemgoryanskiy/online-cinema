import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getMongoDbConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleOptions> => ({
  uri: await configService.get('MONGO_URI'),
});
