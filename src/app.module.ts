import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { WartModule } from './wart/wart.module';
import { WartEntity } from './wart/entities/wart.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
