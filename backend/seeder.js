import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import User from './models/userModel.js';
import ContentProject from './models/contentProjectModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

// Sample users
const users = [
  {
    name: 'Admin User',
    email: 'admin@email.com',
    password: 'admin123',
    isAdmin: true,
    preferences: {
      defaultLocation: 'United States',
      defaultLanguage: 'English',
      defaultTone: 'professional',
      defaultCategory: 'Technology'
    }
  },
  {
    name: 'John Doe',
    email: 'john@email.com',
    password: 'user123',
    isAdmin: false,
    preferences: {
      defaultLocation: 'Germany',
      defaultLanguage: 'English',
      defaultTone: 'friendly',
      defaultCategory: 'fashion'
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane@email.com',
    password: 'user123',
    isAdmin: false,
    preferences: {
      defaultLocation: 'United Kingdom',
      defaultLanguage: 'English',
      defaultTone: 'persuasive',
      defaultCategory: 'beauty'
    }
  },
  {
    name: 'Demo User',
    email: 'demo@email.com',
    password: 'demo123',
    isAdmin: false,
    preferences: {
      defaultLocation: 'Canada',
      defaultLanguage: 'English',
      defaultTone: 'professional',
      defaultCategory: 'luxury'
    }
  }
];

// Sample content projects (will be created after users)
const sampleProjects = [
  {
    title: 'Smart Home Device Blog Post',
    projectType: 'content-drafting',
    location: 'Germany',
    language: 'English',
    tone: 'persuasive',
    category: 'Technology',
    contentIntent: 'Promotional blog post about smart home devices for the German market',
    desiredLength: '400-500 words',
    status: 'completed',
    generatedContent: `# The Future of Smart Living: Why German Homes Are Embracing Smart Technology

Smart home technology is revolutionizing how German households manage their daily lives. With the increasing focus on energy efficiency and convenience, smart devices have become essential components of modern German homes.

## Leading Smart Home Trends in Germany

From intelligent thermostats that optimize heating costs to smart security systems that provide peace of mind, German consumers are investing in technology that delivers both comfort and savings. The German market shows particular interest in:

- Energy-efficient smart thermostats
- Intelligent lighting systems
- Advanced security cameras and doorbells
- Smart appliances that reduce energy consumption

## Why Choose Smart Home Technology?

German homeowners appreciate the precision and reliability that smart devices offer. These systems not only provide convenience but also align with Germany's commitment to environmental sustainability and energy efficiency.

Smart home technology represents the perfect blend of innovation and practicality that German consumers value most.`,
    trendingKeywords: [
      { keyword: 'smart home', interest: 85, region: 'Germany' },
      { keyword: 'smart devices', interest: 72, region: 'Germany' },
      { keyword: 'home automation', interest: 68, region: 'Germany' }
    ]
  },
  {
    title: 'Product Description Enhancement',
    projectType: 'content-modification',
    location: 'United States',
    language: 'English',
    tone: 'professional',
    category: 'Technology',
    originalContent: 'Our new tablet has a good battery life and a decent screen resolution.',
    modificationType: 'elaborate',
    status: 'completed',
    generatedContent: `Experience exceptional performance with our cutting-edge tablet, engineered to deliver outstanding battery life that keeps you productive throughout your entire day. The device features an impressive high-resolution display that brings your content to life with crystal-clear detail and vibrant colors.

With advanced battery optimization technology, this tablet provides up to 12 hours of continuous use, making it perfect for professionals, students, and entertainment enthusiasts alike. The premium screen resolution ensures that whether you're working on detailed presentations, streaming your favorite shows, or reading digital content, every pixel delivers stunning clarity and precision.

This tablet combines powerful performance with sleek design, offering the perfect balance of functionality and style for today's demanding digital lifestyle.`,
    trendingKeywords: [
      { keyword: 'tablet', interest: 78, region: 'United States' },
      { keyword: 'battery life', interest: 65, region: 'United States' },
      { keyword: 'screen resolution', interest: 58, region: 'United States' }
    ]
  },
  {
    title: 'Fashion Brand Image Prompt',
    projectType: 'image-prompt',
    location: 'France',
    language: 'English',
    tone: 'professional',
    category: 'fashion',
    originalContent: 'Luxury summer collection featuring flowing dresses and elegant accessories for the sophisticated woman.',
    visualStyle: 'luxury, soft lighting, elegant atmosphere',
    status: 'completed',
    generatedContent: `Create a sophisticated fashion photography scene featuring a luxury summer collection. The image should showcase flowing, elegant dresses in soft, premium fabrics with delicate textures. 

**Visual Elements:**
- Model wearing a flowing summer dress in soft, neutral tones (cream, blush, or soft beige)
- Elegant accessories including delicate jewelry, a structured handbag, and refined footwear
- Soft, natural lighting with warm golden hour ambiance
- Luxurious outdoor setting such as a French garden terrace or elegant boutique interior
- Background with subtle architectural elements or lush greenery
- Composition emphasizing grace and sophistication

**Technical Specifications:**
- High-end fashion photography style
- Soft, diffused lighting with gentle shadows
- Warm color palette with sophisticated neutral tones
- Clean, uncluttered composition
- Professional model posing naturally
- Shallow depth of field focusing on the clothing details
- Aspect ratio: 4:5 (Instagram-ready)
- Style: Editorial fashion photography with luxury brand aesthetic`,
    trendingKeywords: [
      { keyword: 'luxury fashion', interest: 82, region: 'France' },
      { keyword: 'summer collection', interest: 76, region: 'France' },
      { keyword: 'elegant dresses', interest: 69, region: 'France' }
    ]
  }
];

const importData = async () => {
  try {
    // Clear existing data
    await ContentProject.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!'.red.inverse);

    // Create users
    const createdUsers = await User.insertMany(users);
    console.log('Users imported!'.green.inverse);

    // Update sample projects with actual user IDs
    const adminUser = createdUsers[0]._id;
    const johnUser = createdUsers[1]._id;
    const janeUser = createdUsers[2]._id;

    sampleProjects[0].user = johnUser;
    sampleProjects[1].user = janeUser;
    sampleProjects[2].user = janeUser;

    // Create sample projects
    await ContentProject.insertMany(sampleProjects);
    console.log('Sample projects imported!'.green.inverse);

    // Update user stats
    await User.findByIdAndUpdate(johnUser, {
      $set: {
        'stats.totalProjects': 1,
        'stats.contentDrafts': 1
      }
    });

    await User.findByIdAndUpdate(janeUser, {
      $set: {
        'stats.totalProjects': 2,
        'stats.contentModifications': 1,
        'stats.imagePrompts': 1
      }
    });

    console.log('User stats updated!'.green.inverse);
    console.log('Data Imported Successfully!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await ContentProject.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}