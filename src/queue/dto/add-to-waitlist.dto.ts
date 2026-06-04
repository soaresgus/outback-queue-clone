import { IsString, IsNotEmpty, IsNumber, Matches } from 'class-validator';

export class AddToWaitlistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?\d{10,15}$/, {
    message: 'phoneNumber must be a valid phone number',
  })
  phoneNumber: string;

  @IsNumber()
  @IsNotEmpty()
  partySize: number;
}
