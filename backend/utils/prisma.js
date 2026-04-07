const { PrismaClient } = require('@prisma/client');

// This prevents multiple instances during hot-reloads (nodemon)
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

module.exports = prisma;