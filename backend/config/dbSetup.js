import User from '../models/userModel.js';
import ContentProject from '../models/contentProjectModel.js';

export const setupDatabase = async () => {
  try {
    console.log('Setting up database indexes...');

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ 'stats.lastActiveAt': -1 });
    
    // ContentProject indexes
    await ContentProject.collection.createIndex({ user: 1, createdAt: -1 });
    await ContentProject.collection.createIndex({ projectType: 1 });
    await ContentProject.collection.createIndex({ status: 1 });
    await ContentProject.collection.createIndex({ location: 1, category: 1 });
    await ContentProject.collection.createIndex({ 'trendingKeywords.keyword': 1 });
    

    console.log('Database indexes created successfully!');

    // Set up text search indexes for content search
    try {
      await ContentProject.collection.createIndex({
        title: 'text',
        contentIntent: 'text',
        generatedContent: 'text',
        originalContent: 'text'
      }, {
        name: 'content_text_search',
        default_language: 'none'
      });
      console.log('Text search indexes created successfully!');
    } catch (error) {
      if (error.code !== 85) { // Index already exists
        console.error('Error creating text search indexes:', error);
      }
    }

  } catch (error) {
    if (error.code !== 85) { // Index already exists
      console.error('Error setting up database:', error);
    }
  }
};

