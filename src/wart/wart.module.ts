import { Module } from '@nestjs/common';
import { WartService } from './wart.service';
import { WartController } from './wart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WartEntity } from './entities/wart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WartEntity])],
  controllers: [WartController],
  providers: [WartService],
})
export class WartModule {}
