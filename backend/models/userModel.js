import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    // Content creation preferences
    preferences: {
      defaultLocation: {
        type: String,
        default: 'United States'
      },
      defaultLanguage: {
        type: String,
        default: 'English'
      },
      defaultTone: {
        type: String,
        default: 'professional'
      },
      defaultCategory: {
        type: String,
        default: 'Technology'
      }
    },
    // Usage statistics
    stats: {
      totalProjects: {
        type: Number,
        default: 0
      },
      contentDrafts: {
        type: Number,
        default: 0
      },
      contentModifications: {
        type: Number,
        default: 0
      },
      imagePrompts: {
        type: Number,
        default: 0
      },
      lastActiveAt: {
        type: Date,
        default: Date.now
      }
    }
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
