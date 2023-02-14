import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  /**
   * @example login@example.com
   */
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email!: string;

  /**
   * @example c001SMSnet!@#
   */
  @IsNotEmpty()
  @IsString()
  readonly password!: string;
}
