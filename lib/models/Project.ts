import mongoose, { Schema, Model } from 'mongoose';

export interface IProject {
  clientId: string;
  clientName: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  startDate: string;
  deadline: string;
  progress: number;
  status: string;
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const projectSchema = new Schema<IProject>(
  {
    clientId: { type: String, required: true },
    clientName: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [{ type: String }],
    startDate: { type: String, required: true },
    deadline: { type: String, required: true },
    progress: { type: Number, default: 0 },
    status: { type: String, default: 'Planning' },
    image: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export const ProjectModel: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);

export default ProjectModel;
