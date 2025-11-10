const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,  //" Alice " → it becomes "Alice".
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true //Lowercase ensures "Alice@GMAIL.com" → "alice@gmail.com".
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true //automatically adds createdAt and updatedAt fields.
});
// Pre-save Hook
// Hash password before saving
// Hooks in Mongoose run before/after events (like save, update, remove).
// Here: before saving → check if password was modified.
// If yes → hash it with bcrypt.
// genSalt(10) → generates random salt (extra randomness).
// bcrypt.hash(password, salt) → produces a hashed string.
// Result: The database never stores plain text passwords
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
// Used when logging in:
// Take user input (candidatePassword).
// Compare it with the hashed DB password.
// bcrypt internally hashes candidate and checks match.
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password); // returns True or False;
};

// Remove password from JSON output
//When we return user data in API response → remove password field.
userSchema.methods.toJSON = function() {
  const user = this.toObject(); // converts that special Mongoose document into a plain JavaScript object.
  delete user.password;
  return user;
};


//Creates a User model → used in controllers (e.g., User.findOne, User.create).
module.exports = mongoose.model('User', userSchema);
