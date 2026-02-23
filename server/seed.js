import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Idea from './models/Idea.js';
import Job from './models/Job.js';
import Application from './models/Application.js';

dotenv.config();

// Test credentials for each role
const testUsers = [
  {
    name: 'Student User',
    email: 'student@test.com',
    password: 'student123',
    role: 'student',
    isVerified: true,
    isApproved: true,
    status: 'active'
  },
  {
    name: 'Investor User',
    email: 'investor@test.com',
    password: 'investor123',
    role: 'investor',
    isVerified: true,
    isApproved: true,
    status: 'active'
  },
  {
    name: 'Employer User',
    email: 'employer@test.com',
    password: 'employer123',
    role: 'employer',
    isVerified: true,
    isApproved: true,
    status: 'active'
  },
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin',
    isVerified: true,
    isApproved: true,
    status: 'active'
  },
  // Additional test users
  {
    name: 'John Student',
    email: 'john.student@test.com',
    password: 'password123',
    role: 'student',
    isVerified: true,
    isApproved: true,
    status: 'active'
  },
  {
    name: 'Sarah Investor',
    email: 'sarah.investor@test.com',
    password: 'password123',
    role: 'investor',
    isVerified: true,
    isApproved: false, // Pending approval
    status: 'active'
  },
  {
    name: 'Tech Company',
    email: 'hr@techcompany.test',
    password: 'password123',
    role: 'employer',
    isVerified: false, // Pending verification
    isApproved: true,
    status: 'active'
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await Idea.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    console.log('🗑️  Database cleared');
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    throw error;
  }
};

const seedUsers = async () => {
  try {
    console.log('\n📝 Creating test users...\n');
    
    const createdUsers = [];
    
    for (const userData of testUsers) {
      const user = await User.create(userData);
      createdUsers.push({
        name: user.name,
        email: user.email,
        password: userData.password, // Store plain password for display
        role: user.role,
        isApproved: user.isApproved,
        isVerified: user.isVerified,
        id: user._id
      });
      
      console.log(`✅ Created ${user.role.toUpperCase()}: ${user.email}`);
    }
    
    return createdUsers;
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    throw error;
  }
};

const seedIdeas = async (users) => {
  try {
    console.log('\n💡 Creating sample ideas...\n');
    
    const student = users.find(u => u.role === 'student');
    
    if (!student) {
      console.log('⚠️  No student user found, skipping idea creation');
      return [];
    }
    
    const sampleIdeas = [
      {
        title: 'AI-Powered Study Assistant',
        publicSummary: 'An intelligent study companion that helps students learn more effectively using AI',
        fullDescription: 'This platform uses advanced AI algorithms to create personalized study plans, generate practice questions, and provide instant explanations for complex topics. It adapts to each student\'s learning style and pace.',
        creator: student.id,
        category: 'Education',
        industry: 'EdTech',
        stage: 'prototype',
        status: 'approved'
      },
      {
        title: 'EcoTrack - Carbon Footprint Tracker',
        publicSummary: 'Mobile app to track and reduce your personal carbon footprint',
        fullDescription: 'EcoTrack helps users monitor their daily activities and calculate their carbon emissions. It provides actionable insights and challenges to help reduce environmental impact. Features include community challenges, carbon offset marketplace, and AI-powered recommendations.',
        creator: student.id,
        category: 'Sustainability',
        industry: 'GreenTech',
        stage: 'mvp',
        status: 'approved'
      },
      {
        title: 'HealthBridge - Telemedicine Platform',
        publicSummary: 'Connecting patients with healthcare providers through secure video consultations',
        fullDescription: 'HealthBridge is a comprehensive telemedicine solution that enables remote consultations, prescription management, and health record storage. Built with HIPAA compliance and end-to-end encryption.',
        creator: student.id,
        category: 'Healthcare',
        industry: 'HealthTech',
        stage: 'concept',
        status: 'pending'
      }
    ];
    
    const createdIdeas = [];
    
    for (const ideaData of sampleIdeas) {
      const idea = await Idea.create(ideaData);
      createdIdeas.push(idea);
      console.log(`✅ Created idea: ${idea.title} (${idea.status})`);
    }
    
    return createdIdeas;
  } catch (error) {
    console.error('❌ Error seeding ideas:', error.message);
    throw error;
  }
};

const seedJobs = async (users) => {
  try {
    console.log('\n💼 Creating sample jobs...\n');
    
    const employer = users.find(u => u.role === 'employer' && u.isVerified);
    
    if (!employer) {
      console.log('⚠️  No verified employer found, skipping job creation');
      return [];
    }
    
    const sampleJobs = [
      {
        title: 'Frontend Developer Intern',
        description: 'We are looking for a talented frontend developer intern to join our team. You will work on building responsive web applications using React and modern JavaScript.',
        employer: employer.id,
        jobType: 'internship',
        location: 'Mumbai, India',
        workMode: 'hybrid',
        duration: '3 months',
        stipend: '₹15,000 - ₹20,000/month',
        skillsRequired: ['React', 'JavaScript', 'HTML', 'CSS', 'Git'],
        status: 'approved'
      },
      {
        title: 'Full Stack Developer',
        description: 'Join our startup as a full-stack developer. Work with MERN stack to build scalable web applications. Great opportunity for learning and growth.',
        employer: employer.id,
        jobType: 'full-time',
        location: 'Bangalore, India',
        workMode: 'remote',
        duration: 'Permanent',
        stipend: '₹6-8 LPA',
        skillsRequired: ['MongoDB', 'Express', 'React', 'Node.js', 'REST API'],
        status: 'approved'
      },
      {
        title: 'UI/UX Design Intern',
        description: 'Creative UI/UX design intern needed to help design beautiful and intuitive user interfaces for our mobile and web applications.',
        employer: employer.id,
        jobType: 'internship',
        location: 'Delhi, India',
        workMode: 'remote',
        duration: '6 months',
        stipend: '₹10,000 - ₹15,000/month',
        skillsRequired: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
        status: 'pending'
      }
    ];
    
    const createdJobs = [];
    
    for (const jobData of sampleJobs) {
      const job = await Job.create(jobData);
      createdJobs.push(job);
      console.log(`✅ Created job: ${job.title} (${job.status})`);
    }
    
    return createdJobs;
  } catch (error) {
    console.error('❌ Error seeding jobs:', error.message);
    throw error;
  }
};

const displayCredentials = (users) => {
  console.log('\n' + '='.repeat(70));
  console.log('🔑 TEST CREDENTIALS FOR LOGIN');
  console.log('='.repeat(70));
  
  const roleGroups = {
    'STUDENT': users.filter(u => u.role === 'student'),
    'INVESTOR': users.filter(u => u.role === 'investor'),
    'EMPLOYER': users.filter(u => u.role === 'employer'),
    'ADMIN': users.filter(u => u.role === 'admin')
  };
  
  for (const [roleName, roleUsers] of Object.entries(roleGroups)) {
    if (roleUsers.length > 0) {
      console.log(`\n📋 ${roleName} CREDENTIALS`);
      console.log('-'.repeat(70));
      
      roleUsers.forEach((user, index) => {
        console.log(`\n   ${index + 1}. ${user.name}`);
        console.log(`      Email:    ${user.email}`);
        console.log(`      Password: ${user.password}`);
        console.log(`      Approved: ${user.isApproved ? '✅' : '⏳ Pending'}`);
        console.log(`      Verified: ${user.isVerified ? '✅' : '⏳ Pending'}`);
      });
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('\n💡 Quick Login URLs:');
  console.log('   Client: http://localhost:5173/login');
  console.log('   Admin:  http://localhost:5174/login');
  console.log('\n' + '='.repeat(70) + '\n');
};

const createQuickReference = (users) => {
  const reference = {
    student: users.find(u => u.role === 'student'),
    investor: users.find(u => u.role === 'investor'),
    employer: users.find(u => u.role === 'employer'),
    admin: users.find(u => u.role === 'admin')
  };
  
  const quickRef = `
# Quick Reference - Test Credentials

## Student Login
- Email: ${reference.student.email}
- Password: ${reference.student.password}

## Investor Login  
- Email: ${reference.investor.email}
- Password: ${reference.investor.password}

## Employer Login
- Email: ${reference.employer.email}
- Password: ${reference.employer.password}

## Admin Login
- Email: ${reference.admin.email}
- Password: ${reference.admin.password}

---
Generated: ${new Date().toLocaleString()}
`;
  
  return quickRef;
};

const seedDatabase = async () => {
  console.log('🚀 Starting database seeding...\n');
  
  try {
    await connectDB();
    
    // Clear existing data
    await clearDatabase();
    
    // Seed users
    const users = await seedUsers();
    
    // Seed ideas
    await seedIdeas(users);
    
    // Seed jobs
    await seedJobs(users);
    
    // Display credentials
    displayCredentials(users);
    
    // Create quick reference
    const quickRef = createQuickReference(users);
    console.log(quickRef);
    
    console.log('✨ Database seeding completed successfully!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
