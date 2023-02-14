import { IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';

export class CreateLineDto {
  /**
   * @example 1234567890
   */
  @IsNotEmpty()
  @IsString()
  @Length(10)
  readonly phoneNumber!: string;

  /**
   * @example Demo note.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly note!: string;
}
