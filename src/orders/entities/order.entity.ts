import { BaseEntity } from 'src/common/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { OrderStatus } from '../enums/status-order.enum';
import { TypeOrder } from '../enums/type-order.enum';
import { Topic } from 'src/topic/entities/topic.entity';

@Entity({ name: 'orders' })
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column({ name: 'illustrative_image_id', nullable: true })
  illustrativeImageId: string;

  @Column({ nullable: true })
  note: string;

  @Column({ type: 'datetime' })
  deadline: Date;

  @Column({ name: 'user_creator_id' })
  userCreatorId: string;

  @Column({
    nullable: true,
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.NOT_RECEIVED,
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: TypeOrder,
  })
  type: TypeOrder;

    @ManyToOne(() => Topic, topic => topic.orders, { eager: true })
    @JoinColumn({ name: 'topic_id' })
    topic: Topic;

}
