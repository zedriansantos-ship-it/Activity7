import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'New Marketing Campaign', description: 'The name of the project' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Launch plan for Q4 product line', description: 'A short description of the project' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2026-02-01', description: 'The date when the project begins' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: '2026-06-30', description: 'The targeted completion date' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;
}