import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WartEntity } from './entities/wart.entity';

import { supabase } from 'src/supabase';

@Injectable()
export class WartService {
  constructor(
    @InjectRepository(WartEntity)
    private readonly wartRepository: Repository<WartEntity>,
  ) {}

  async findAll({
    pageNumber = 1,
    pageSize = 20,
  }: {
    pageNumber?: number;
    pageSize?: number;
  }) {
    const skip = (pageNumber - 1) * pageSize;
    const [warts, total] = await this.wartRepository.findAndCount({
      order: { id: 'DESC' },
      skip,
      take: pageSize,
    });

    return {
      warts,
      pageNumber,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async seedFromSupabase() {
    const { data: buckets, error: bucketserror } =
      await supabase.storage.listBuckets();

    const { data: files, error } = await supabase.storage
      .from('warts')
      .list('', { limit: 1000, offset: 0 });

    console.log({ count: files?.length, first: files?.[0] });
    console.log({ files, error, buckets, bucketserror });

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
