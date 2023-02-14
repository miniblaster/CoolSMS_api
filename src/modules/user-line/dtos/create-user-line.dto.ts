import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserLineDto {
  /**
   * @example Demo Label
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly label!: string;

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
   * @example Demo note.
   */
  @IsOptional()
  @IsString()
  readonly note!: string;
}
