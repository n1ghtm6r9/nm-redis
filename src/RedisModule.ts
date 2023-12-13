import { Module, Global } from '@nestjs/common';
import { configKey, IConfig } from '@nmxjs/config';
import { createClient } from 'redis';
import { redisServiceKey } from './constants';
import { IRedisService } from './interfaces';

@Global()
@Module({
  providers: [
    {
      provide: redisServiceKey,
      useFactory: async (config: IConfig): Promise<IRedisService> => {
        if (!config.cache) {
          return null;
        }
        const client = <IRedisService>createClient({
          url: `redis://${config.cache.host}:${config.cache.port}`,
          ...(config.cache.username ? { username: config.cache.username } : {}),
          ...(config.cache.password ? { password: config.cache.password } : {}),
        });
        await client.connect();
        return client;
      },
      inject: [configKey],
    },
  ],
  exports: [redisServiceKey],
})
export class RedisModule {}
