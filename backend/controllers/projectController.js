// // Quick top-level summary before we dig in
// // This controller talks to the Project model and the User model.
// // It expects req.user to already exist (set by auth middleware — the logged-in user).
// // It validates incoming data with validationResult(req) (from express-validator).
// // It enforces permissions (owner/editor/viewer) using helper methods on the Project model (isMember, canEdit, canManageMembers).
// // Responses use standard HTTP codes: 200 ok, 201 created, 400 bad input, 403 forbidden, 404 not found, 500 server error.


// const { validationResult } = require('express-validator'); //Validates incoming data (like checking if email is valid)
// const Project = require('../models/Project');
// const User = require('../models/User');

// const getProjects = async (req, res) => {
//   try{

//     // Finds all projects where the members array contains the current user’s id.
//     //     Why this is here:
//     // Users should only see projects they belong to.
//     // Populate makes the response friendlier (you don’t have to do extra requests to get the user name/email).

//     const projects = await Project.find({
//       'members.user': req.user._id 
//     }) 
//     // replaces the owner id with a small object containing username and email.
//     .populate('owner', 'username email') 
//     // does the same for each member entry.
//     .populate('members.user', 'username email') 
//     // returns newest-updated projects first.
//     .sort({ updatedAt: -1 });
    
//       res.json(projects);
// // [
// // {
// // _id: "66fa...9ac2",
// // name: "LearningJavaScript",
// // description: "Common guys! keep your spirit high!",
// // language: "javascript",
// // code: "// ... maybe present",
// // owner: { _id: "66fa...1a2b", username: "shyamaJu", email: "..." }, // populated
// // members: [
// // { user: { _id: "66fb...2b11", username: "shyamaJu", email: "..." }, role: "owner" }
// // // possibly other members with role "editor"|"viewer"
// // ],
// // createdAt: "...",
// // updatedAt: "..."
// // },
// // ...
// // ]


  
//   }catch (error){
//     console.error('Get projects error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// // Validates input.
// // Creates a new Project. owner is set to the logged-in user.
// // When saved, the pre('save') hook (in your model) automatically adds the owner to members.
// // Populates owner and members.user and returns the project with 201 Created.
// const createProject = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { name, description, language } = req.body;

//     const project = new Project({
//       name,
//       description,
//       owner: req.user._id,
//       language: language || 'javascript'
//     });

//     await project.save();
//     await project.populate('owner', 'username email');
//     await project.populate('members.user', 'username email');

//     res.status(201).json(project);
//   } catch (error) {
//     console.error('Create project error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// // Loads the project by ID and populates user info.
// // If project not found → 404.
// // If current user is not a member of the project → 403 Forbidden.
// // Else returns the project.
// const getProject = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id)
//       .populate('owner', 'username email')
//       .populate('members.user', 'username email');

//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     if (!project.isMember(req.user._id)) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     res.json(project);
//   } catch (error) {
//     console.error('Get project error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const updateProject = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const project = await Project.findById(req.params.id);

//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     // Check if user can edit (for code updates) or manage members (for other updates)
//     const { name, description, language, code } = req.body;
    
//     if (code !== undefined) {
//       // For code updates, check if user can edit
//       if (!project.canEdit(req.user._id)) {
//         return res.status(403).json({ message: 'Access denied' });
//       }
//       project.code = code;
//     } else {
//       // For other updates, check if user can manage members
//       if (!project.canManageMembers(req.user._id)) {
//         return res.status(403).json({ message: 'Access denied' });
//       }
//       if (name) project.name = name;
//       if (description !== undefined) project.description = description;
//       if (language) project.language = language;
//     }

//     await project.save();
//     await project.populate('owner', 'username email');
//     await project.populate('members.user', 'username email');

//     res.json(project);
//   } catch (error) {
//     console.error('Update project error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const deleteProject = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);

//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     if (project.owner.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Only the owner can delete the project' });
//     }

//     await Project.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Project deleted successfully' });
//   } catch (error) {
//     console.error('Delete project error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };



// // Only an owner (canManageMembers) can add members.
// // Looks up the user by email (so only registered users can be added).
// // Prevents duplicate members via project.isMember.
// // Adds the user to members array with the chosen role.
// const addMember = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const project = await Project.findById(req.params.id);

//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     if (!project.canManageMembers(req.user._id)) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const { email, role = 'viewer' } = req.body;

//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Check if user is already a member
//     if (project.isMember(user._id)) {
//       return res.status(400).json({ message: 'User is already a member' });
//     }

//     // Add member
//     project.members.push({
//       user: user._id,
//       role
//     });

//     await project.save();
//     await project.populate('owner', 'username email');
//     await project.populate('members.user', 'username email');

//     res.json(project);
//   } catch (error) {
//     console.error('Add member error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const removeMember = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);

//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     if (!project.canManageMembers(req.user._id)) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const { userId } = req.params;

//     // Can't remove the owner
//     if (project.owner.toString() === userId) {
//       return res.status(400).json({ message: 'Cannot remove the project owner' });
//     }

//     // Can't remove yourself
//     if (req.user._id.toString() === userId) {
//       return res.status(400).json({ message: 'Cannot remove yourself' });
//     }

//     project.members = project.members.filter(
//       member => member.user.toString() !== userId
//     );

//     await project.save();
//     await project.populate('owner', 'username email');
//     await project.populate('members.user', 'username email');

//     res.json(project);
//   } catch (error) {
//     console.error('Remove member error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const updateMemberRole = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const project = await Project.findById(req.params.id);

//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     if (!project.canManageMembers(req.user._id)) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const { userId } = req.params;
//     const { role } = req.body;

//     // Can't change owner's role
//     if (project.owner.toString() === userId) {
//       return res.status(400).json({ message: 'Cannot change owner role' });
//     }

//     const member = project.members.find(
//       member => member.user.toString() === userId
//     );

//     if (!member) {
//       return res.status(404).json({ message: 'Member not found' });
//     }

//     member.role = role;
//     await project.save();
//     await project.populate('owner', 'username email');
//     await project.populate('members.user', 'username email');

//     res.json(project);
//   } catch (error) {
//     console.error('Update member role error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = {
//   getProjects,
//   createProject,
//   getProject,
//   updateProject,
//   deleteProject,
//   addMember,
//   removeMember,
//   updateMemberRole
// };

const prisma = require('../utils/prisma');
const { PrismaClient } = require('@prisma/client');

// Get all projects where user is a member
const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: req.user.id // Changed from userId to id
          }
        }
      },
      include: {
        owner: { select: { id: true, username: true, email: true } },
        members: {
          include: {
            user: { select: { id: true, username: true, email: true } }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create Project
const createProject = async (req, res) => {
  try {
    const { name, description, language } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        language: language || 'javascript',
        ownerId: req.user.id,
        members: {
          create: {
            userId: req.user.id,
            role: 'owner'
          }
        }
      },
      include: {
        owner: { select: { id: true, username: true, email: true } },
        members: {
          include: {
            user: { select: { id: true, username: true, email: true } }
          }
        }
      }
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single project
const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Ensure this is coming from your auth middleware

    const project = await prisma.project.findFirst({
      where: {
        id: id,
        members: {
          some: {
            userId: userId // ✅ Validates membership directly in the query
          }
        }
      },
      include: {
        owner: { select: { id: true, username: true } },
        members: { 
          include: { 
            user: { select: { id: true, username: true } } 
          } 
        }
      }
    });

    if (!project) {
      // If the project exists but user isn't a member, findFirst returns null
      return res.status(403).json({ message: "Access denied" }); 
    }

    res.json(project);
  } catch (error) {
    console.error("Fetch Project Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Update project
const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { name, description, language, code } = req.body;

    const member = await prisma.member.findFirst({
      where: {
        projectId,
        userId: req.user.id
      }
    });

    if (!member) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (code !== undefined) {
      if (member.role !== 'owner' && member.role !== 'editor') {
        return res.status(403).json({ message: 'No edit permission' });
      }
      await prisma.project.update({
        where: { id: projectId },
        data: { code }
      });
    } else {
      if (member.role !== 'owner') {
        return res.status(403).json({ message: 'Access denied' });
      }
      await prisma.project.update({
        where: { id: projectId },
        data: { name, description, language }
      });
    }

    const updated = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: { select: { id: true, username: true } },
        members: { include: { user: { select: { id: true, username: true } } } }
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!project || project.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


//const { PrismaClient } = require('@prisma/client');
//const prisma = new PrismaClient();

const addMember = async (req, res) => {
  try {
    const { email, role = 'viewer' } = req.body;
    const projectId = req.params.id;

    // 1. Fetch Project to check ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // 2. Ownership Check (Now working thanks to your Auth fix!)
    if (String(project.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Only the owner can invite members' });
    }

    // 3. Find User to add
    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 4. Create the Member record directly 
    // ✅ This avoids the "undefined (reading 'create')" error
    const newMember = await prisma.member.create({
      data: {
        projectId: projectId,
        userId: userToAdd.id,
        role: role
      },
      include: {
        user: {
          select: { username: true, email: true }
        }
      }
    });

    res.json(newMember);

  } catch (error) {
    console.error('Add Member Error:', error);
    
    // Check for "Unique Constraint" error (P2002) 
    // This happens if the user is already a member
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

const removeMember = async (req, res) => {
  try {
    const { id: projectId, userId } = req.params;
    const loggedInUserId = req.user.id;

    // 1. Fetch project to check ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // 2. Authorization: Only the owner can remove members
    if (project.ownerId !== loggedInUserId) {
      return res.status(403).json({ message: 'Access denied: Only the owner can remove members' });
    }

    // 3. Logic: Cannot remove the owner
    if (project.ownerId === userId) {
      return res.status(400).json({ message: 'Cannot remove the project owner' });
    }

    // 4. Logic: Cannot remove yourself (You should have a "Leave Project" route for this)
    if (loggedInUserId === userId) {
      return res.status(400).json({ message: 'Cannot remove yourself. Use "Leave Project" instead.' });
    }

    // 5. Delete the specific record from the ProjectMember table
    // Prisma uses deleteMany or delete. deleteMany is safer if the record might not exist.
    const deleteResult = await prisma.member.deleteMany({
      where: {
        projectId: projectId,
        userId: userId,
      },
    });

    if (deleteResult.count === 0) {
      return res.status(404).json({ message: 'Member not found in this project' });
    }

    // 6. Return the updated project state
    const updatedProject = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: { select: { username: true, email: true } },
        members: { include: { user: { select: { username: true, email: true } } } }
      }
    });

    res.json(updatedProject);
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateMemberRole = async (req, res) => {
  try {
    const { id: projectId, userId } = req.params;
    const { role } = req.body;
    const loggedInUserId = req.user.id;

    // 1. Fetch project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // 2. Authorization: Only owner can change roles
    if (project.ownerId !== loggedInUserId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // 3. Logic: Cannot change owner's role
    if (project.ownerId === userId) {
      return res.status(400).json({ message: 'Cannot change owner role' });
    }

    // 4. Update the specific ProjectMember record
    // We use updateMany here to target the unique combination of Project and User
    const updateResult = await prisma.member.updateMany({
      where: {
        projectId: projectId,
        userId: userId,
      },
      data: {
        role: role,
      },
    });

    if (updateResult.count === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // 5. Fetch and return updated project
    const updatedProject = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: { select: { username: true, email: true } },
        members: { include: { user: { select: { username: true, email: true } } } }
      }
    });

    res.json(updatedProject);
  } catch (error) {
    console.error('Update member role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  updateMemberRole
};