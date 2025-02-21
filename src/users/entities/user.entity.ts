import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'timestamp', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  groupId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  accountType: string;

  @Column({ nullable: true })
  sex: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  titleEn: string;

  @Column({ nullable: true })
  permanentResidence: string;

  @Column({ nullable: true })
  permanentResidenceEn: string;

  @Column({ nullable: true })
  currentAddress: string;

  @Column({ nullable: true })
  currentAddressEn: string;

  @Column({ nullable: true })
  taxNumber: string;

  @Column({ nullable: true })
  passportNo: string;

  @Column({ nullable: true })
  passportPlaceOfIssue: string;

  @Column({ nullable: true })
  passportPlaceOfIssueEn: string;

  @Column({ nullable: true })
  idNumber: string;

  @Column({ nullable: true })
  idPlaceOfIssue: string;

  @Column({ nullable: true })
  idPlaceOfIssueEn: string;

  @Column({ type: 'timestamp', nullable: true })
  idDateOfIssue: Date;

  @Column({ type: 'timestamp', nullable: true })
  contractSignedDate: Date;

  @Column({ nullable: true })
  contractNumber: string;

  @Column({ nullable: true })
  group: string;
}
