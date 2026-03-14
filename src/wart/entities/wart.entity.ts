import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'warts' })
export class WartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'varchar' })
  author: string | null;

  @Column({ nullable: true, type: 'varchar' })
  description: string | null;

  @Column()
  image: string;

  @Column({ nullable: true, unique: true, type: 'varchar' })
  sourceId: string | null;

  @Column({ default: 'manual' })
  sourceType: string;
}
