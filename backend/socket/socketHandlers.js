// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const Project = require('../models/Project');
// const Message = require('../models/Message');

// const setupSocketHandlers = (io) => {
//   // Authentication middleware for Socket.IO
//   io.use(async (socket, next) => {
//     try {
//       const token = socket.handshake.auth.token;
//       if (!token) {
//         return next(new Error('Authentication error'));
//       }

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findById(decoded.userId).select('-password');
      
//       if (!user) {
//         return next(new Error('Authentication error'));
//       }

//       socket.userId = user._id.toString();
//       socket.user = user;
//       next();
//     } catch (error) {
//       next(new Error('Authentication error'));
//     }
//   });

//   io.on('connection', (socket) => {
//     console.log(`User ${socket.user.username} connected`);

//     // Join project room
//     socket.on('join-project', async (projectId) => {
//       try {
//         const project = await Project.findById(projectId);
        
//         if (!project) {
//           socket.emit('error', { message: 'Project not found' });
//           return;
//         }

//         if (!project.isMember(socket.userId)) {
//           socket.emit('error', { message: 'Access denied' });
//           return;
//         }

//         socket.join(projectId);
//         socket.currentProject = projectId;
        
//         // Notify others in the project
//         socket.to(projectId).emit('user-joined', {
//           user: {
//             id: socket.user._id,
//             username: socket.user.username
//           }
//         });

//         // Send current code to the user
//         socket.emit('code-update', {
//           code: project.code,
//           language: project.language
//         });

//         console.log(`User ${socket.user.username} joined project ${projectId}`);
//       } catch (error) {
//         console.error('Join project error:', error);
//         socket.emit('error', { message: 'Server error' });
//       }
//     });

//     // Handle code changes
//     socket.on('code-change', async (data) => {
//       try {
//         if (!socket.currentProject) {
//           return;
//         }

//         const project = await Project.findById(socket.currentProject);
        
//         if (!project || !project.canEdit(socket.userId)) {
//           return;
//         }

//         // Update project code
//         project.code = data.code;
//         await project.save();

//         // Broadcast to other users in the project
//         socket.to(socket.currentProject).emit('code-change', {
//           code: data.code,
//           userId: socket.userId,
//           username: socket.user.username
//         });
//       } catch (error) {
//         console.error('Code change error:', error);
//       }
//     });

//     // Handle cursor position
//     socket.on('cursor-position', (data) => {
//       if (socket.currentProject) {
//         socket.to(socket.currentProject).emit('cursor-position', {
//           userId: socket.userId,
//           username: socket.user.username,
//           position: data.position
//         });
//       }
//     });

//     // Handle chat messages
//     socket.on('send-message', async (data) => {
//       try {
//         if (!socket.currentProject) {
//           return;
//         }

//         const project = await Project.findById(socket.currentProject);
        
//         if (!project || !project.isMember(socket.userId)) {
//           return;
//         }

//         const message = new Message({
//           project: socket.currentProject,
//           sender: socket.userId,
//           message: data.message
//         });

//         await message.save();
//         await message.populate('sender', 'username email');

//         // Broadcast message to all users in the project
//         io.to(socket.currentProject).emit('new-message', message);
//       } catch (error) {
//         console.error('Send message error:', error);
//         socket.emit('error', { message: 'Failed to send message' });
//       }
//     });

//     // Handle typing indicators
//     socket.on('typing-start', () => {
//       if (socket.currentProject) {
//         socket.to(socket.currentProject).emit('user-typing', {
//           userId: socket.userId,
//           username: socket.user.username
//         });
//       }
//     });

//     socket.on('typing-stop', () => {
//       if (socket.currentProject) {
//         socket.to(socket.currentProject).emit('user-stopped-typing', {
//           userId: socket.userId
//         });
//       }
//     });

//     // Handle disconnect
//     socket.on('disconnect', () => {
//       if (socket.currentProject) {
//         socket.to(socket.currentProject).emit('user-left', {
//           user: {
//             id: socket.user._id,
//             username: socket.user.username
//           }
//         });
//       }
//       console.log(`User ${socket.user.username} disconnected`);
//     });
//   });
// };

// module.exports = { setupSocketHandlers };


const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma'); // ✅ Prisma instead of Mongoose

const setupSocketHandlers = (io) => {

  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ❌ OLD
      // const user = await User.findById(decoded.userId).select('-password');

      // ✅ NEW (Prisma)
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          username: true,
          email: true
        }
      });

      if (!user) {
        return next(new Error('Authentication error'));
      }

      socket.userId = user.id;
      socket.user = user;

      next();

    } catch (error) {
      next(new Error('Authentication error'));
    }
  });


  io.on('connection', (socket) => {
    console.log(`User ${socket.user.username} connected`);

    // Join project room
    socket.on('join-project', async (projectId) => {
      try {

        // ❌ OLD
        // const project = await Project.findById(projectId);

        // ✅ NEW
        const project = await prisma.project.findUnique({
          where: { id: projectId }
        });

        if (!project) {
          socket.emit('error', { message: 'Project not found' });
          return;
        }

        // ❌ OLD: project.isMember()
        // ✅ NEW: check membership via Member table
        const member = await prisma.member.findFirst({
          where: {
            projectId,
            userId: socket.userId
          }
        });

        if (!member) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        socket.join(projectId);
        socket.currentProject = projectId;

        // Notify others in the project
        socket.to(projectId).emit('user-joined', {
          user: {
            id: socket.userId,
            username: socket.user.username
          }
        });

        // Send current code to the user
        socket.emit('code-update', {
          code: project.code,
          language: project.language
        });

        console.log(`User ${socket.user.username} joined project ${projectId}`);

      } catch (error) {
        console.error('Join project error:', error);
        socket.emit('error', { message: 'Server error' });
      }
    });


    // Handle code changes
    socket.on('code-change', async (data) => {
      try {
        if (!socket.currentProject) return;

        const projectId = socket.currentProject;

        // ❌ OLD
        // project.canEdit()

        // ✅ NEW
        const member = await prisma.member.findFirst({
          where: {
            projectId,
            userId: socket.userId
          }
        });

        if (!member || (member.role !== 'owner' && member.role !== 'editor')) {
          return;
        }

        // Update project code
        await prisma.project.update({
          where: { id: projectId },
          data: { code: data.code }
        });

        // Broadcast to other users
        socket.to(projectId).emit('code-change', {
          code: data.code,
          userId: socket.userId,
          username: socket.user.username
        });

      } catch (error) {
        console.error('Code change error:', error);
      }
    });


    // Handle cursor position
    socket.on('cursor-position', (data) => {
      if (socket.currentProject) {
        socket.to(socket.currentProject).emit('cursor-position', {
          userId: socket.userId,
          username: socket.user.username,
          position: data.position
        });
      }
    });


    // Handle chat messages
    socket.on('send-message', async (data) => {
      try {
        if (!socket.currentProject) return;

        const projectId = socket.currentProject;

        // Check membership
        const member = await prisma.member.findFirst({
          where: {
            projectId,
            userId: socket.userId
          }
        });

        if (!member) return;

        // ❌ OLD
        // new Message(...).save()

        // ✅ NEW
        const message = await prisma.message.create({
          data: {
            projectId,
            senderId: socket.userId,
            message: data.message
          },
          include: {
            sender: {
              select: {
                username: true,
                email: true
              }
            }
          }
        });

        // Broadcast message
        io.to(projectId).emit('new-message', message);

      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });


    // Handle typing indicators
    socket.on('typing-start', () => {
      if (socket.currentProject) {
        socket.to(socket.currentProject).emit('user-typing', {
          userId: socket.userId,
          username: socket.user.username
        });
      }
    });

    socket.on('typing-stop', () => {
      if (socket.currentProject) {
        socket.to(socket.currentProject).emit('user-stopped-typing', {
          userId: socket.userId
        });
      }
    });


    // Handle disconnect
    socket.on('disconnect', () => {
      if (socket.currentProject) {
        socket.to(socket.currentProject).emit('user-left', {
          user: {
            id: socket.userId,
            username: socket.user.username
          }
        });
      }

      console.log(`User ${socket.user.username} disconnected`);
    });

  });
};

module.exports = { setupSocketHandlers };