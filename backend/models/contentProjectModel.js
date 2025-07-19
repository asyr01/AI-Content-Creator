import mongoose from 'mongoose';

const contentProjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  projectType: {
    type: String,
    required: true,
    enum: ['content-drafting', 'content-modification', 'image-prompt']
  },
  
  // Common inputs for all project types
  location: {
    type: String,
    required: function() {
      return this.projectType !== 'content-modification';
    }
  },
  language: {
    type: String,
    required: true
  },
  tone: {
    type: String,
    required: true,
    enum: ['persuasive', 'professional', 'friendly', 'casual', 'formal', 'enthusiastic', 'informative']
  },
  category: {
    type: String,
    required: function() {
      return this.projectType !== 'content-modification';
    },
    enum: ['luxury', 'apparel', 'Technology', 'fashion', 'toys', 'home-garden', 'sports', 'beauty', 'automotive', 'books']
  },
  
  // Content Drafting specific fields
  contentIntent: {
    type: String
  },
  desiredLength: {
    type: String
  },
  
  // Content Modification specific fields
  originalContent: {
    type: String
  },
  modificationType: {
    type: String,
    enum: ['elaborate', 'summarize', 'rephrase']
  },
  
  // Image Prompt specific fields
  visualStyle: {
    type: String
  },
  
  // Generated content
  generatedContent: {
    type: String
  },
  
  // Trending data used
  trendingKeywords: [{
    keyword: String,
    interest: Number,
    region: String
  }],
  
  // Status and metadata
  status: {
    type: String,
    enum: ['draft', 'generating', 'completed', 'failed'],
    default: 'draft'
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

contentProjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ContentProject = mongoose.model('ContentProject', contentProjectSchema);

export default ContentProject;