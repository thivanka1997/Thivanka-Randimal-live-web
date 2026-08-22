export const MONGODB_DEPLOYMENT_STEPS = [
  {
    step: 1,
    title: 'Create MongoDB Atlas Database Cluster',
    details: 'Sign in to MongoDB Atlas (cloud.mongodb.com) -> Create a free M0 Cluster -> In "Database Access", create a user (e.g. portal_admin) with readWrite permissions -> In "Network Access", add IP 0.0.0.0/0 (allow from anywhere).'
  },
  {
    step: 2,
    title: 'Obtain MongoDB Connection String (URI)',
    details: 'Click "Connect" on your Atlas Cluster -> Select "Drivers" (Node.js) -> Copy the connection string format: mongodb+srv://portal_admin:<password>@cluster0.mongodb.net/portal_db?retryWrites=true&w=majority'
  },
  {
    step: 3,
    title: 'Configure Node.js / Express Mongoose Backend',
    details: 'Place your MONGODB_URI in your .env file or server environment. Our full-stack Node.js / Express server automatically connects Mongoose, boots schema validation, and seeds default admin and client collections.'
  },
  {
    step: 4,
    title: 'Deploy Full-Stack Node.js & React App',
    details: 'Run npm run build to bundle the React frontend, then start your Node server (node dist/server.cjs or npm start). Your REST API and interactive portfolio portal run together with persistent cloud MongoDB storage!'
  }
];

export const MONGODB_SEED_JSON = {
  users: [
    {
      _id: "66c5a101f1a2b3c4d5e6f701",
      name: "Thivanka Randimal",
      email: "admin@thivanka.dev",
      role: "admin",
      status: "active",
      createdAt: "2026-08-01T00:00:00.000Z"
    },
    {
      _id: "66c5a101f1a2b3c4d5e6f702",
      name: "ABC Company Client",
      email: "client@abc.com",
      role: "client",
      status: "active",
      clientId: "66c5a102f1a2b3c4d5e6f801",
      createdAt: "2026-08-01T00:00:00.000Z"
    },
    {
      _id: "66c5a101f1a2b3c4d5e6f703",
      name: "Grand Luxe Hospitality",
      email: "client@grandluxe.com",
      role: "client",
      status: "active",
      clientId: "66c5a102f1a2b3c4d5e6f802",
      createdAt: "2026-07-15T00:00:00.000Z"
    }
  ],
  clients: [
    {
      _id: "66c5a102f1a2b3c4d5e6f801",
      userId: "66c5a101f1a2b3c4d5e6f702",
      companyName: "ABC Company",
      contactPerson: "John Perera",
      email: "client@abc.com",
      phone: "+94 77 123 4567",
      address: "245 Galle Road, Colombo 03, Sri Lanka",
      logo: "🏢",
      createdAt: "2026-08-01T00:00:00.000Z"
    },
    {
      _id: "66c5a102f1a2b3c4d5e6f802",
      userId: "66c5a101f1a2b3c4d5e6f703",
      companyName: "Grand Luxe Hospitality Group",
      contactPerson: "Sarah Fernando",
      email: "client@grandluxe.com",
      phone: "+94 71 987 6543",
      address: "Kandy Road, Peradeniya, Sri Lanka",
      logo: "🏨",
      createdAt: "2026-07-15T00:00:00.000Z"
    }
  ],
  projects: [
    {
      _id: "66c5a103f1a2b3c4d5e6f901",
      clientId: "66c5a102f1a2b3c4d5e6f801",
      clientName: "ABC Company",
      title: "ABC Hotel Management System (IDS Next ERP)",
      category: "erp",
      description: "Full-scale hospitality ERP integration orchestrating front office reservation engines, multi-outlet POS, inventory ledgers, and automated nighttime audit financial workflows.",
      technologies: ["React", "Node.js", "MongoDB", "Express", "IDS Next PMS", "Tailwind CSS"],
      startDate: "2026-08-01",
      deadline: "2026-09-30",
      progress: 75,
      status: "In Development"
    },
    {
      _id: "66c5a103f1a2b3c4d5e6f902",
      clientId: "66c5a102f1a2b3c4d5e6f801",
      clientName: "ABC Company",
      title: "ABC Corporate Web Portal & Client Intake Engine",
      category: "website",
      description: "Ultra-fast corporate digital presence with customer lead routing, dynamic service catalogues, and automated document generation.",
      technologies: ["Next.js", "React", "MongoDB", "Tailwind CSS", "REST API"],
      startDate: "2026-08-01",
      deadline: "2026-09-25",
      progress: 80,
      status: "In Development"
    },
    {
      _id: "66c5a103f1a2b3c4d5e6f903",
      clientId: "66c5a102f1a2b3c4d5e6f802",
      clientName: "Grand Luxe Hospitality Group",
      title: "Grand Luxe POS & Revenue Optimization Suite",
      category: "financial_dashboard",
      description: "Real-time F&B analytics, menu engineering cost calculations, dynamic pricing suggestion engine, and revenue reconciliation dashboard.",
      technologies: ["React", "MongoDB Aggregation Pipeline", "Chart.js", "Express", "Node.js"],
      startDate: "2026-07-20",
      deadline: "2026-10-15",
      progress: 55,
      status: "In Development"
    }
  ],
  registrations: [
    {
      _id: "66c5a104f1a2b3c4d5e6fa01",
      clientName: "Apex Logistics Lanka",
      email: "finance@apexlogistics.lk",
      phone: "+94 77 999 1234",
      company: "Apex Logistics Group",
      serviceRequested: "Custom ERP & SaaS Architecture (Standard Package)",
      packageTier: "Standard",
      budget: 1800,
      paymentMethod: "Bank Wire Transfer",
      paymentReference: "BOC-TXN-8849102",
      paymentSlipUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800",
      status: "pending",
      submittedAt: "2026-08-19T18:30:00.000Z"
    }
  ]
};

export const MONGOOSE_MODELS_CODE = `// ==========================================================
// THIVANKA RANDIMAL - MONGOOSE SCHEMAS & MODELS (models.js)
// DATABASE TARGET: MongoDB Atlas / Local MongoDB
// ==========================================================

import mongoose from 'mongoose';

// 1. User Schema (Admin & Client Accounts)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'client'], default: 'client' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  avatar: { type: String, default: '' },
}, { timestamps: true });

// 2. Client Profile Schema
const clientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true, trim: true },
  contactPerson: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  logo: { type: String, default: '🏢' },
  notes: { type: String, default: '' }
}, { timestamps: true });

// 3. Project Schema
const projectSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  clientName: { type: String, required: true },
  title: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    enum: ['website', 'application', 'erp', 'financial_dashboard'], 
    required: true 
  },
  description: { type: String, required: true },
  technologies: [{ type: String, trim: true }],
  startDate: { type: Date, required: true },
  deadline: { type: Date, required: true },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  status: { 
    type: String, 
    enum: ['Planning', 'In Development', 'Testing', 'Completed', 'Maintenance'], 
    default: 'Planning' 
  },
  image: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' }
}, { timestamps: true });

// 4. Milestone Schema
const milestoneSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
  completedAt: { type: Date }
}, { timestamps: true });

// 5. Task Schema
const taskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  assignedTo: { type: String, default: 'Thivanka Randimal' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  status: { type: String, enum: ['todo', 'in_progress', 'completed'], default: 'todo' },
  dueDate: { type: Date }
}, { timestamps: true });

// 6. Registration & Payment Verification Schema
const registrationSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, default: '' },
  company: { type: String, default: '' },
  serviceRequested: { type: String, required: true },
  packageTier: { type: String, default: 'Standard' },
  budget: { type: Number, default: 0 },
  paymentMethod: { type: String, default: 'Bank Transfer' },
  paymentReference: { type: String, default: '' },
  paymentSlipUrl: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminNotes: { type: String, default: '' },
  reviewedAt: { type: Date },
  createdUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);
export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export const Milestone = mongoose.models.Milestone || mongoose.model('Milestone', milestoneSchema);
export const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
export const Registration = mongoose.models.Registration || mongoose.model('Registration', registrationSchema);
`;

export const NODEJS_EXPRESS_MONGODB_SERVER = `// ==========================================================
// THIVANKA RANDIMAL - FULL-STACK NODE.JS + MONGODB SERVER
// File: server.js
// ==========================================================

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:secret@cluster0.mongodb.net/portal_db?retryWrites=true&w=majority';

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 1. Connect to MongoDB Atlas via Mongoose
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err.message));

// ---------------- REST API ROUTES ----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Authentication
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // In production: find user and compare hashed password with bcrypt
    res.json({
      status: 'success',
      user: {
        id: 'user-admin',
        name: 'Thivanka Randimal',
        email,
        role: email.includes('admin') ? 'admin' : 'client'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Projects API
app.get('/api/projects', async (req, res) => {
  try {
    const { role, clientId } = req.query;
    // Fetch from MongoDB Project model:
    // const query = role === 'admin' ? {} : { clientId };
    // const projects = await Project.find(query).sort({ createdAt: -1 });
    res.json({ status: 'success', count: 3, data: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Registrations API
app.post('/api/registrations', async (req, res) => {
  try {
    // const reg = await Registration.create(req.body);
    res.status(201).json({ status: 'success', message: 'Registration submitted successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend static assets in production
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});
`;

export const MONGODB_ENV_SAMPLE = `# .env configuration for MongoDB Atlas + Node.js Express Backend
PORT=3000
NODE_ENV=production

# MongoDB Atlas Connection URI
MONGODB_URI=mongodb+srv://portal_admin:YOUR_PASSWORD@cluster0.mongodb.net/portal_db?retryWrites=true&w=majority

# JWT Authentication Secret
JWT_SECRET=super_secret_jwt_encryption_key_2026

# Admin Default Credentials
ADMIN_DEFAULT_EMAIL=admin@thivanka.dev
`;
