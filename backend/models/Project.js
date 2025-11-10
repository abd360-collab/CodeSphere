const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({

//   user field will store an ObjectId.
// That ObjectId refers to a document in the User collection (because of ref: 'User').
// Basically, it’s like saying:
// “Each project member is linked to a user in the Users table.”
//UserId
  user: {
    type: mongoose.Schema.Types.ObjectId, // it links to a document in the users collection.
    ref: 'User', //tells Mongoose this ID refers to the User model (used for populating later).
    required: true
  },
  role: {
    type: String,
    enum: ['owner', 'editor', 'viewer'],
    default: 'viewer'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [memberSchema],
  language: {
    type: String,
    default: 'javascript',
    enum: ['javascript', 'python', 'java', 'cpp', 'html', 'css', 'typescript', 'json']
  },
  code: {
    type: String,
    default: '// Welcome to your collaborative code editor!\n// Start coding here...'
  },
  isPrivate: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true //automatically adds createdAt and updatedAt fields.
});



// Add owner as a member when creating project
//This is a hook: code that runs before the project is saved to the database.
projectSchema.pre('save', function(next) {

  // this.isNew is true only when the document is being created for the first time (not on updates).
  if (this.isNew) {
    //Automatically adds the owner into the members list with role 'owner'. 
    // So the creator becomes a member by default.
    this.members.push({
      user: this.owner,
      role: 'owner'
    });
  }
  next();
});

// Method to check if user is a member
// Adds a function to every project document you get from the database
// call to check membership.
projectSchema.methods.isMember = function(userId) {
  return this.members.some(member => 
    member.user.toString() === userId.toString() || 
    member.user.equals(userId)
  );
};

// Method to get user's role in project
projectSchema.methods.getUserRole = function(userId) {
  const member = this.members.find(member => 
    member.user.toString() === userId.toString() || 
    member.user.equals(userId)
  );
  return member ? member.role : null;
};

// Method to check if user can edit
projectSchema.methods.canEdit = function(userId) {
  const role = this.getUserRole(userId);
  return role === 'owner' || role === 'editor';
};

// Method to check if user can manage members
projectSchema.methods.canManageMembers = function(userId) {
  return this.getUserRole(userId) === 'owner';
};

module.exports = mongoose.model('Project', projectSchema);

