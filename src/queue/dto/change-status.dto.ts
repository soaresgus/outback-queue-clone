import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class ChangeStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['seated', 'no_show'])
  status: 'seated' | 'no_show';
}
