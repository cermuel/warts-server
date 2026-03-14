import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { WartModule } from './wart/wart.module';
import { WartEntity } from './wart/entities/wart.entity';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      entities: [WartEntity],
      synchronize: process.env.ENVIRONMENT == 'production' ? false : true,
    }),
    WartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
