import { IsString, IsNotEmpty, IsIn, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Draft Social Media Posts', description: 'The main title of the task' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Prepare content calendar for next month', description: 'Detailed explanation of what needs to be done' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'todo', enum: ['todo', 'in-progress', 'completed'], description: 'Current status of the task' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['todo', 'in-progress', 'completed'])
  status: string;

  @ApiProperty({ example: '2026-02-14', description: 'Due date for the task' })
  @IsString()
  @IsNotEmpty()
  deadline: string;

  @ApiProperty({ example: '65a12b3cde4f5g6h7i8j9k0l', description: 'MongoDB ObjectID of the Project' })
  @IsMongoId()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ example: '65a12b3cde4f5g6h7i8j9k0m', description: 'MongoDB ObjectID of the User (optional)', required: false })
  @IsMongoId()
  userId: string;
}