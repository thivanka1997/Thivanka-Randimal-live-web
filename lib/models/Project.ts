import mongoose, { Schema, Model } from 'mongoose';

export interface IProject {
  id?: string;
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
    id: { type: String },
    clientId: { type: String, default: '' },
    clientName: { type: String, default: '' },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, default: '' },
    technologies: [{ type: String }],
    startDate: { type: String, default: '' },
    deadline: { type: String, default: '' },
    progress: { type: Number, default: 0 },
    status: { type: String, default: 'Planning' },
    image: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
  },
  { timestamps: true, strict: false }
);

projectSchema.index({ id: 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ clientId: 1 });

export const ProjectModel: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);

export default ProjectModel;
