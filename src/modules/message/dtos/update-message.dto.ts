import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateMessageDto {
  /**
   * @example false
   */
  @IsOptional()
  @IsBoolean()
  readonly isVisible!: boolean;

  /**
   * @example false
   */
  @IsOptional()
  @IsBoolean()
  readonly isRead!: boolean;

  /**
   * @example false
   */
  @IsOptional()
  @IsBoolean()
  readonly deleted!: boolean;
}
