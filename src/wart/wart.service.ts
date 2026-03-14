import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WartEntity } from './entities/wart.entity';
import { supabase } from 'src/supabase';
import Redis from 'ioredis';
import { getOrSetCache } from 'src/utils/helpers';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class WartService {
  constructor(
    @InjectRepository(WartEntity)
    private readonly wartRepository: Repository<WartEntity>,
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async findAll({
    pageNumber = 1,
    pageSize = 20,
  }: {
    pageNumber?: number;
    pageSize?: number;
  }) {
    let redis = this.redis;
    const skip = (pageNumber - 1) * pageSize;

    const data = await getOrSetCache(
      `warts-pageNumber-${pageNumber}-pageSize-${pageSize}`,
      async () => {
        const [warts, total] = await this.wartRepository.findAndCount({
          order: { id: 'DESC' },
          skip,
          take: pageSize,
        });
        return { warts, total };
      },
      redis,
    );

    return {
      warts: data.warts,
      pageNumber,
      pageSize,
      total: data.total,
      totalPages: Math.ceil(data.total / pageSize),
    };
  }

  async seedFromSupabase() {
    const { data: buckets, error: bucketserror } =
      await supabase.storage.listBuckets();

    const { data: files, error } = await supabase.storage
      .from('warts')
      .list('', { limit: 1000, offset: 0 });

    if (error) throw new InternalServerErrorException(error.message);

    const records = files.map((file) =>
      this.wartRepository.create({
        image: supabase.storage.from('warts').getPublicUrl(file.name).data
          .publicUrl,
        sourceId: file.name,
        sourceType: 'panels',
      }),
    );

    return this.wartRepository.save(records);
  }
}
