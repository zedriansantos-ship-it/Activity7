import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Project } from './project.schema';
import { User } from './user.schema';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: 'todo' })
  status: string;

  @Prop()
  deadline: string;

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  projectId: Project;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);