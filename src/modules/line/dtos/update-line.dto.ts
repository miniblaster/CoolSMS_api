import {
  IsNotEmpty,
  IsString,
  IsEnum,
  Length,
  MaxLength,
} from 'class-validator';
import { LineStatus } from '../line.types';

export class UpdateLineDto {
  /**
   * @example 1234567890
   */
  @IsNotEmpty()
  @IsString()
  @Length(10)
  readonly phoneNumber!: string;

  /**
   * @example pending
   */
  @IsNotEmpty()
  @IsEnum(LineStatus)
  readonly status!: LineStatus;

  /**
   * @example Demo note.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly note!: string;
}
