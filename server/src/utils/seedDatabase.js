import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Role from '../models/Role.js';
import User from '../models/User.js';
import Filter from '../models/Filter.js';
import Document from '../models/Document.js';
import RBACService from '../services/RBACService.js';

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Seeding database...');
    await Role.deleteMany({});
    await User.deleteMany({});
    await Filter.deleteMany({});
    await Document.deleteMany({});

    for (const roleName of RBACService.getRoles()) {
      const permissions = RBACService.getDefaultPermissions(roleName);
      await new Role({
        name: roleName,
        permissions: new Map(Object.entries(permissions))
      }).save();
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await new User({
      name: 'Admin',
      lastname: 'User',
      email: 'admin@admin.com',
      username: 'admin',
      password: hashedPassword,
      role: 'gerente'
    }).save();

    const hashedPassword2 = await bcrypt.hash('user123', 10);
    await new User({
      name: 'User',
      lastname: 'User',
      email: 'user@user.com',
      username: 'user',
      password: hashedPassword2,
      role: 'ejecutivo'
    }).save();

    console.log('Seed complete - Admin: admin@admin.com / admin123, User: user@user.com / user123');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

seed();
