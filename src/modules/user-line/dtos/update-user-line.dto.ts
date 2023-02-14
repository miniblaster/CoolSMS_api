import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { UserLineStatus } from '../user-line.types';
export class UpdateUserLineDto {
  /**
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  @IsNotEmpty()
  @IsString()
  readonly userId!: string;

  /**
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  @IsNotEmpty()
  @IsString()
  readonly lineId!: string;

  /**
   * @example Demo Label
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly label!: string;

  /**
   * @example
   */
  @IsNotEmpty()
  @IsEnum(UserLineStatus)
  readonly status!: UserLineStatus;

  /**
   * @example Demo note
   */
  @IsOptional()
  @IsString()
  readonly note: string;

  /**
   * @example false
   */
  @IsOptional()
  @IsBoolean()
  readonly deleted: boolean;
}
