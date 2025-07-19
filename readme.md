# AI Content Creator for E-commerce

> **Professional AI-powered content creation platform** built with the MERN stack, Google's Gemini AI, and real-time market intelligence for e-commerce businesses.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-16%2B-green.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![MongoDB](https://img.shields.io/badge/mongodb-latest-green.svg)

## 🚀 Overview

The AI Content Creator is a comprehensive platform designed for e-commerce businesses to generate high-quality, trend-driven content at scale. By leveraging Google's advanced Gemini AI and real-time Google Trends data via SerpAPI, the platform ensures your content is not only engaging but also perfectly aligned with current market demands.

## ✨ Key Features

### 🎯 **Content Creation Suite**
- **✍️ Content Drafting** - Generate original marketing content from scratch using trending keywords and market insights
- **🔄 Content Modification** - Transform existing content with three modes: elaborate, summarize, or rephrase
- **🎨 Image Prompt Generation** - Create detailed prompts for AI image generation tools with multiple aspect ratios
- **🖼️ Image Generation** - Generate actual images using Pollinations.ai free service

### 📊 **Market Intelligence Integration**
- **📈 Real-time Trends** - Live integration with Google Trends API via SerpAPI for current market data
- **🌍 Global Targeting** - Support for 12+ countries with geo-specific content optimization
- **🏷️ Category Optimization** - Specialized content for 10+ e-commerce categories (luxury, apparel, technology, fashion, toys, home-garden, sports, beauty, automotive, books)
- **📍 Location-based Content** - Geo-targeted content for specific markets with proper language support

### 🛡️ **Enterprise Security**
- **🔒 Jailbreak Prevention** - Advanced AI prompt injection protection with 50+ malicious pattern detection
- **🛠️ Content Filtering** - Multi-layer content validation and sanitization
- **🔐 Secure Authentication** - JWT-based user authentication with bcrypt password hashing
- **📋 Audit Logging** - Comprehensive activity tracking and user statistics

### 💼 **Business Management Tools**
- **📊 Project Dashboard** - Track and organize all content creation projects by type and status
- **📈 Analytics & Insights** - Monitor user statistics including total projects, content drafts, modifications, and image prompts
- **👥 User Management** - Multi-user support with admin panel and role-based access control
- **📱 Responsive Design** - Seamless experience across all devices with Bootstrap UI

## 🛠️ Technology Stack

### Backend
- **Node.js** (v16+) - JavaScript runtime with ES6+ modules
- **Express.js** - Web application framework with CORS support
- **MongoDB** - NoSQL database with Mongoose ODM and database indexing
- **Google Generative AI** - Gemini 1.5 Flash model integration
- **SerpAPI** - Google Trends data access with rate limiting
- **JWT** - Stateless authentication and authorization
- **bcryptjs** - Password security with salt rounds

### Frontend
- **React 18** - Modern UI library with functional components and hooks
- **Redux Toolkit** - Predictable state management with createApi
- **React Router DOM** - Client-side routing with protected routes
- **React Bootstrap** - Responsive UI components and grid system
- **React Icons** - Comprehensive icon library
- **React Toastify** - User notifications and feedback
- **React Helmet Async** - SEO meta tag management

### Security & Performance
- **CORS** - Cross-origin resource sharing configuration
- **Cookie Parser** - Secure cookie handling
- **Input Validation** - Comprehensive data sanitization
- **Error Handling** - Async middleware with proper error responses
- **Environment Validation** - Required environment variable checking

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v8.0.0 or higher) - Comes with Node.js
- **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/downloads)

## 🔑 Required API Keys

### 1. MongoDB Database
- **Free Option**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
- **Local Option**: [MongoDB Community Server](https://www.mongodb.com/try/download/community)

### 2. Google Gemini AI API
- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create a new API key
- Keep it secure and never commit to version control

### 3. SerpAPI (Google Trends)
- Sign up at [SerpAPI](https://serpapi.com/)
- Get your API key from the dashboard
- Free tier includes 100 searches/month

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd content-gen
```

### 2. Environment Configuration
Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_strong_jwt_secret_key

# AI & Trends APIs
GEMINI_API_KEY=your_gemini_api_key
SERPAPI_KEY=your_serpapi_key
```

**⚠️ Security Note**: Replace all placeholder values with your actual credentials. Never commit the `.env` file to version control.

### 3. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 4. Database Setup (Optional)

Seed the database with sample data:

```bash
# Import sample data
npm run data:import

# Or destroy existing data
npm run data:destroy
```

**Sample Users Created:**
- **Admin**: admin@email.com / admin123
- **Demo User**: demo@email.com / demo123  
- **John Doe**: john@email.com / user123
- **Jane Smith**: jane@email.com / user123

## 🚀 Running the Application

### Development Mode (Recommended)
```bash
# Runs both frontend and backend concurrently
npm run dev
```

### Individual Services
```bash
# Backend only (API server)
npm run server

# Frontend only (React development server)
npm run client
```

### Production Build
```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000 (displays "Gemini AI API is running....")

## 📖 Usage Guide

### 🎯 Getting Started

1. **Register/Login** - Create an account or sign in to access the platform
2. **Choose Content Type** - Select from three main content creation options
3. **Configure Settings** - Set your target market, language, and tone preferences
4. **Generate Content** - Let AI create professional content based on current trends

### ✍️ Content Drafting Workflow

1. **Project Setup**
   - Enter project title and description
   - Select target location (Germany, US, UK, France, etc.)
   - Choose content language and tone (persuasive, professional, friendly, casual, formal, enthusiastic, informative)
   
2. **Content Configuration**
   - Define your content intent and purpose
   - Set desired content length (300-400 words default)
   - Select category (luxury, apparel, technology, fashion, toys, home-garden, sports, beauty, automotive, books)
   
3. **Generation Process**
   - AI fetches real-time trending keywords via SerpAPI
   - Gemini AI analyzes trends and generates content optimized for your market
   - Content integrates trending topics naturally while maintaining professional tone
   
4. **Review & Export**
   - Review generated content with trending keywords used
   - View project status (draft, generating, completed, failed)
   - Save to your project library for future reference

### 🔄 Content Modification Options

- **Elaborate**: Expand brief content with detailed explanations, context, and supporting information
- **Summarize**: Condense long-form content to key points and essential information
- **Rephrase**: Rewrite content with improved clarity, tone, and readability

### 🎨 Image Prompt Generation

1. **Input Base Content** - Provide product or content description
2. **Define Visual Style** - Specify aesthetic preferences and mood
3. **Set Aspect Ratio** - Choose format (square, portrait, story, landscape, banner, post)
4. **Generate Prompt** - Get detailed AI image generation instructions optimized for your specifications
5. **Generate Image** - Create actual images using integrated Pollinations.ai service


## 🔗 API Documentation

### Authentication Endpoints
```
POST /api/users/register     - Register new user
POST /api/users/login        - User login
POST /api/users/logout       - User logout
GET  /api/users/profile      - Get user profile
PUT  /api/users/profile      - Update user profile
```

### Content Creation Endpoints
```
POST /api/content/draft          - Create new content draft
POST /api/content/modify         - Modify existing content  
POST /api/content/image-prompt   - Generate image prompts
POST /api/content/generate-image - Generate actual images
```

### Project Management Endpoints
```
GET    /api/content/projects     - Get user's projects
GET    /api/content/projects/:id - Get specific project
DELETE /api/content/projects/:id - Delete project
```


### Admin Endpoints
```
GET    /api/users               - Get all users (admin only)
GET    /api/users/:id           - Get user by ID (admin only)
PUT    /api/users/:id           - Update user (admin only)
DELETE /api/users/:id           - Delete user (admin only)
```

## 🏗️ Project Structure

```
content-gen/
├── backend/
│   ├── config/
│   │   ├── db.js                     # MongoDB connection with retry logic
│   │   └── dbSetup.js               # Database indexes and optimization
│   ├── controllers/
│   │   ├── contentController.js      # Content creation logic with trend integration
│   │   └── userController.js         # User management with statistics
│   ├── middleware/
│   │   ├── asyncHandler.js          # Async error handling wrapper
│   │   ├── authMiddleware.js         # JWT authentication middleware
│   │   ├── checkObjectId.js          # MongoDB ObjectId validation
│   │   ├── errorMiddleware.js        # Centralized error handling
│   │   └── jailbreakPrevention.js    # AI security and prompt injection protection
│   ├── models/
│   │   ├── contentProjectModel.js    # Content projects schema with project types
│   │   └── userModel.js              # User data schema with preferences and statistics
│   ├── routes/
│   │   ├── contentRoutes.js          # Content creation endpoints
│   │   └── userRoutes.js             # User management endpoints
│   ├── services/
│   │   └── trendsService.js          # Google Trends integration via SerpAPI
│   ├── utils/
│   │   ├── geminiClient.js           # Gemini AI client configuration
│   │   └── generateToken.js          # JWT token generation utility
│   ├── seeder.js                     # Database seeding with sample data
│   └── server.js                     # Express server with environment validation
├── frontend/
│   ├── public/
│   │   ├── index.html               # Main HTML template
│   │   ├── favicon.ico              # Site icon
│   │   ├── logo192.png              # App logo (192x192)
│   │   ├── logo512.png              # App logo (512x512)
│   │   ├── manifest.json            # PWA manifest
│   │   └── robots.txt               # SEO robots file
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── AdminRoute.jsx       # Admin route protection
│   │   │   ├── Footer.jsx           # App footer component
│   │   │   ├── FormContainer.jsx    # Form wrapper component
│   │   │   ├── Header.jsx           # Navigation header with auth state
│   │   │   ├── Loader.jsx           # Loading spinner component
│   │   │   ├── Message.jsx          # Alert messages component
│   │   │   ├── Meta.jsx             # SEO meta tags component
│   │   │   └── PrivateRoute.jsx     # Authentication route protection
│   │   ├── screens/                 # Page components
│   │   │   ├── ContentDraftScreen.jsx    # Content drafting form
│   │   │   ├── ContentModifyScreen.jsx   # Content modification form
│   │   │   ├── HomeScreen.jsx            # Landing page with feature overview
│   │   │   ├── ImagePromptScreen.jsx     # Image prompt generation form
│   │   │   ├── LoginScreen.jsx           # User login form
│   │   │   ├── ProfileScreen.jsx         # User profile management
│   │   │   ├── ProjectDetailScreen.jsx   # Individual project details
│   │   │   ├── ProjectsScreen.jsx        # Project dashboard
│   │   │   ├── RegisterScreen.jsx        # User registration form
│   │   │   └── admin/                    # Admin-only pages
│   │   │       ├── UserEditScreen.jsx    # Edit user details
│   │   │       └── UserListScreen.jsx    # User management dashboard
│   │   ├── slices/                  # Redux state management
│   │   │   ├── apiSlice.js          # RTK Query API configuration
│   │   │   ├── authSlice.js         # Authentication state management
│   │   │   └── usersApiSlice.js     # User-related API endpoints
│   │   ├── assets/                  # Static assets
│   │   │   ├── logo.png             # App logo
│   │   │   └── styles/              # CSS files
│   │   │       ├── bootstrap.custom.css  # Custom Bootstrap styles
│   │   │       └── index.css             # Global styles
│   │   ├── App.js                   # Main app component with auth persistence
│   │   ├── constants.js             # App constants and configuration
│   │   ├── index.js                 # App entry point
│   │   └── store.js                 # Redux store configuration
├── package.json                     # Root package configuration
├── package-lock.json               # Dependency lock file
└── README.md                        # This documentation
```

## 🛡️ Security Features

### AI Security & Jailbreak Prevention

The platform implements comprehensive protection against AI prompt injection and jailbreak attempts:

#### **Multi-Layer Protection**
- **Pattern Recognition**: Detects 50+ malicious prompt patterns including:
  - API key extraction attempts (`/\bapi\s*key/i`, `/give.*api/i`)
  - Instruction override attempts (`/ignore\s*(all\s*)?(previous\s*)?(instructions?|prompts?|rules?)/i`)
  - Role-playing to break context (`/you\s*are\s*now/i`, `/pretend\s*to\s*be/i`)
  - System information access attempts (`/show\s*me\s*(the\s*)?(system|source|code)/i`)
  - Malicious intent indicators (`/hack/i`, `/exploit/i`, `/bypass/i`)

#### **Content Filtering**: Validates all user inputs before AI processing
- **System Instruction Protection**: Prevents AI from revealing internal prompts
- **Length Limiting**: Blocks excessively long inputs (>5000 characters)

#### **Security Response**
When malicious content is detected:
1. Request is immediately blocked with HTTP 400
2. User receives educational message about appropriate usage
3. Incident is logged with pattern details
4. No data is sent to AI services

### Authentication & Authorization

- **JWT Tokens**: Secure, stateless authentication with expiration handling
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Role-Based Access**: Admin and user permissions with protected routes
- **Session Management**: Automatic token expiration and logout

### Data Protection

- **Input Validation**: All user inputs are sanitized before processing
- **MongoDB Security**: Mongoose ODM prevents injection attacks
- **XSS Protection**: React's built-in XSS prevention
- **CORS Configuration**: Controlled cross-origin access
- **Environment Security**: Required environment variable validation on startup

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Categories
- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **Security Tests**: Jailbreak prevention validation
- **Performance Tests**: Load and stress testing

## 🔧 Troubleshooting

### Common Issues

#### **API Rate Limits**
```
Error: 429 - Too many requests to Gemini API
Solution: The application includes fallback content generation when rate limits are exceeded
```

#### **Environment Variables**
```
Error: Missing required environment variables: MONGO_URI, GEMINI_API_KEY, SERPAPI_KEY, JWT_SECRET
Solution: Check .env file and ensure all required variables are set
```

#### **MongoDB Connection**
```
Error: MongoNetworkError
Solution: Verify MongoDB URI and network connectivity
```

#### **AI Generation Failures**
```
Error: Content generation failed
Solution: Check API keys and rate limits; fallback content will be provided
```

### Debug Mode

Enable detailed logging:
```bash
NODE_ENV=development DEBUG=* npm run dev
```

### Performance Optimization

- **Database Indexing**: Optimized MongoDB queries with proper indexes
- **Error Handling**: Comprehensive fallback mechanisms for API failures
- **Caching**: Client-side state management with Redux
- **Compression**: Production build optimization

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production MongoDB URI
- [ ] Set up SSL certificates
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test all API endpoints
- [ ] Verify security headers

### Deployment Options

#### **Heroku**
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your_production_mongo_uri
heroku config:set JWT_SECRET=your_production_jwt_secret
heroku config:set GEMINI_API_KEY=your_gemini_key
heroku config:set SERPAPI_KEY=your_serpapi_key

# Deploy
git push heroku main
```

#### **Docker**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 📊 Monitoring & Analytics

### User Statistics Tracking
- **Total Projects**: Automatically tracked per user
- **Content Drafts**: Count of content drafting projects
- **Content Modifications**: Count of content modification projects
- **Image Prompts**: Count of image prompt generations
- **Last Activity**: Timestamp of user's last action

### Performance Metrics
- **Response Time**: API endpoint performance monitoring
- **Error Rate**: Failed requests tracking with detailed logging
- **User Activity**: Content generation statistics and usage patterns
- **Resource Usage**: Server performance monitoring

### Logging
- **Application Logs**: Detailed operation logs for debugging
- **Error Logs**: Exception and error tracking with stack traces
- **Security Logs**: Jailbreak attempts and security events
- **Audit Logs**: User actions and data changes

## 🤝 Contributing

We welcome contributions from the community! Please follow these guidelines:

### Development Process

1. **Fork the Repository**
   ```bash
   git fork https://github.com/your-username/content-gen
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Changes**
   - Follow existing code style and patterns
   - Add tests for new features
   - Update documentation as needed

4. **Commit Changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

5. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open Pull Request**
   - Provide clear description of changes
   - Include screenshots if UI changes
   - Reference related issues

### Code Standards

- **JavaScript**: ES6+ syntax with async/await patterns
- **React**: Functional components with hooks (useState, useEffect, useSelector, etc.)
- **Styling**: Bootstrap with custom CSS for responsive design
- **API**: RESTful endpoints with proper HTTP status codes
- **Database**: Mongoose schemas with proper validation
- **Security**: Input validation and sanitization for all user inputs

### Security Guidelines

- Never commit API keys, secrets, or environment variables
- Validate all user inputs before processing
- Follow OWASP security guidelines
- Test security features thoroughly, especially jailbreak prevention
- Use parameterized queries to prevent injection attacks

## 📄 License

This project is licensed under the MIT License:

```
MIT License

Copyright (c) 2024 AI Content Creator

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- **Google Gemini AI** - Advanced content generation capabilities with Gemini 1.5 Flash model
- **SerpAPI** - Reliable Google Trends data access for market intelligence
- **Pollinations.ai** - Free image generation service integration
- **MongoDB** - Robust document database with excellent Node.js support
- **React Community** - Excellent UI library and comprehensive ecosystem
- **Express.js** - Fast, unopinionated web framework for Node.js
- **Bootstrap** - Responsive design framework for modern web applications

## 📞 Support

- **Issues**: Report bugs or request features via GitHub Issues
- **Documentation**: Comprehensive setup and usage instructions in this README
- **Community**: Join discussions about features and improvements

---

**Made with ❤️ for the e-commerce community**

*Transform your content strategy with AI-powered intelligence and real-time market insights.*