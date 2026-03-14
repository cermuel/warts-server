import { Controller, Get, Post, Query } from '@nestjs/common';
import { WartService } from './wart.service';

@Controller('wart')
export class WartController {
  constructor(private readonly wartService: WartService) {}

  @Get()
  findAll(
    @Query('pageSize') pageSize: number = 25,
    @Query('pageNumber') pageNumber: number = 1,
  ) {
    return this.wartService.findAll({ pageNumber, pageSize });
  }

  @Post('seed/supabase')
  seedFromSupabase() {
    return this.wartService.seedFromSupabase();
  }
}
