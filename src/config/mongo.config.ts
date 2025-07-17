import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getMongoDbConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleOptions> => {
  const uri = configService.get<string>('MONGO_URI');

  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  return {
    uri,
  };
};
