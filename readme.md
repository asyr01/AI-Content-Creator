# AI Content Creator for E-commerce

> AI-powered content creation assistant built with the MERN stack, Google's Gemini AI, and Google Trends API.

This application helps e-commerce businesses generate high-quality, trend-driven content including text drafts, content modifications, and image prompts. The system uses real-time Google Trends data to ensure content relevance and market alignment.

<!-- toc -->

- [Features](#features)
- [Usage](#usage)
  - [Env Variables](#env-variables)
  - [Install Dependencies (frontend & backend)](#install-dependencies-frontend--backend)
  - [Run](#run)
- [Build & Deploy](#build--deploy)
  - [Seed Database](#seed-database)
  * [License](#license)

<!-- tocstop -->

## Core Features

### 🎯 **Content Creation Suite**
- **✍️ Content Drafting** - Generate new content from scratch using trending keywords and market insights
- **🔄 Content Modification** - Transform existing content (elaborate, summarize, rephrase)
- **🎨 Image Prompt Generation** - Create detailed prompts for AI image generation tools

### 📊 **Market Intelligence**
- **📈 Real-time Trends** - Integration with Google Trends API for current market data
- **🌍 Global Targeting** - Support for 12+ countries and multiple languages
- **🏷️ Category Optimization** - Specialized content for various e-commerce categories

### 💼 **Business Tools**
- **📋 Project Management** - Track and organize all content creation projects
- **📊 Analytics Dashboard** - Monitor content performance and creation statistics
- **🔐 User Authentication** - Secure user registration and login system
- **👨‍💼 Admin Panel** - User management for administrators

### 🛠️ **Technical Features**
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices
- **💾 Persistent Storage** - All projects and content saved to MongoDB
- **🚀 AI-Powered** - Advanced content generation using Google's Gemini AI
- **🎨 Modern UI** - Clean and intuitive user interface with Bootstrap

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Google Gemini API key

### Get Required API Keys

1. **MongoDB URI** - Create a database at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. **Gemini API Key** - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

> **Note**: Google Trends API is used automatically and doesn't require additional authentication.

### Environment Variables

Rename the `.env.example` file to `.env` and add the following:

```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
SERPAPI_KEY=your_serpapi_key
```

**Important**: Replace all placeholder values with your actual credentials.

### Installation

1. **Install backend dependencies:**
   ```bash
   npm install
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Development mode (runs both frontend and backend):**
   ```bash
   npm run dev
   ```

2. **Backend only:**
   ```bash
   npm run server
   ```

3. **Frontend only:**
   ```bash
   cd frontend
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Database Setup

1. **Seed the database with sample data** (optional):
   ```bash
   npm run data:import
   ```

2. **Clear all data** (if needed):
   ```bash
   npm run data:destroy
   ```

**Sample Users Created:**
- **Admin**: admin@email.com / admin123
- **Demo User**: demo@email.com / demo123
- **John Doe**: john@email.com / user123
- **Jane Smith**: jane@email.com / user123

## Build & Deploy

```bash
# Create production build
npm run build
```

## Usage Guide

### 📝 Content Creation Workflow

1. **Register/Login** - Create an account or sign in to access the platform
2. **Choose Content Type** - Select from three main content creation options:
   - **Content Drafting** - Create new content from scratch
   - **Content Modification** - Transform existing content
   - **Image Prompt Generation** - Generate AI image prompts

### ✍️ Content Drafting
1. Fill in project details (title, location, language, tone, category)
2. Describe your content intent and desired length
3. Click "Generate Content Draft"
4. Review generated content with trending keywords integrated

### 🔄 Content Modification
1. Provide original content and project configuration
2. Choose modification type (elaborate, summarize, or rephrase)
3. Generate modified content with improved tone and trending elements
4. Compare original vs. modified versions side-by-side

### 🎨 Image Prompt Generation
1. Input base content and visual style preferences
2. Configure project settings for target market
3. Generate detailed AI image prompts
4. Copy prompts for use in DALL-E, Midjourney, or other AI image tools

### 📊 Project Management
- **View Projects** - Access all your content projects from the dashboard
- **Track Progress** - Monitor project status and creation timestamps
- **Organize Content** - Filter projects by type and view detailed analytics
- **Manage Content** - View, edit, or delete projects as needed

## Project Structure

```
ai-content-creator/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── contentController.js     # Content creation logic
│   │   ├── geminiController.js      # Gemini AI chat
│   │   └── userController.js        # User management
│   ├── middleware/
│   │   ├── authMiddleware.js        # Authentication
│   │   └── errorMiddleware.js       # Error handling
│   ├── models/
│   │   ├── contentProjectModel.js   # Content projects
│   │   ├── conversationModel.js     # Chat conversations
│   │   └── userModel.js             # User data
│   ├── routes/
│   │   ├── contentRoutes.js         # Content creation endpoints
│   │   ├── geminiRoutes.js          # AI chat endpoints
│   │   └── userRoutes.js            # User endpoints
│   ├── services/
│   │   └── trendsService.js         # Google Trends integration
│   └── server.js                    # Express server
├── frontend/
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   ├── screens/                 # Page components
│   │   │   ├── ContentDraftScreen.jsx
│   │   │   ├── ContentModifyScreen.jsx
│   │   │   ├── ImagePromptScreen.jsx
│   │   │   ├── ProjectsScreen.jsx
│   │   │   └── ProjectDetailScreen.jsx
│   │   ├── slices/                  # Redux state management
│   │   └── App.js                   # Main app component
│   └── public/
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout

### Content Creation
- `POST /api/content/draft` - Create new content draft
- `POST /api/content/modify` - Modify existing content
- `POST /api/content/image-prompt` - Generate image prompts

### Project Management
- `GET /api/content/projects` - Get user's projects
- `GET /api/content/projects/:id` - Get specific project
- `DELETE /api/content/projects/:id` - Delete project

### AI Chat (Legacy)
- `POST /api/gemini/chat` - Send message to AI
- `GET /api/gemini/conversations` - Get user's conversations
- `GET /api/gemini/conversations/:id` - Get specific conversation
- `DELETE /api/gemini/conversations/:id` - Delete conversation

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **Google Generative AI** - Gemini API integration
- **Google Trends API** - Market trend data
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **React Bootstrap** - UI components
- **React Icons** - Icon library
- **React Toastify** - Notifications

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security

- All API endpoints are protected with JWT authentication
- Passwords are hashed using bcryptjs
- Environment variables protect sensitive credentials
- CORS is configured for secure cross-origin requests

## License

The MIT License

Copyright (c) 2025 AI Content Creator

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

