/**
 * Seed script to initialize Role collection with default permissions
 * Run once with: node server/src/scripts/seedRoles.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Role from '../models/Role.js';
import RBACService from '../services/RBACService.js';

dotenv.config();

async function seedRoles() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const roles = RBACService.getRoles();
    console.log(`Seeding ${roles.length} roles...`);

    for (const roleName of roles) {
      const permissions = RBACService.getDefaultPermissions(roleName);

      const existingRole = await Role.findOne({ name: roleName });

      if (existingRole) {
        console.log(`Updating role: ${roleName}`);
        await Role.findOneAndUpdate(
          { name: roleName },
          {
            permissions: new Map(Object.entries(permissions))
          },
          { new: true }
        );
      } else {
        console.log(`Creating role: ${roleName}`);
        const newRole = new Role({
          name: roleName,
          permissions: new Map(Object.entries(permissions))
        });
        await newRole.save();
      }
    }

    console.log('Seeding complete!');
    console.log('\nRoles created/updated:');
    const allRoles = await Role.find();
    allRoles.forEach(role => {
      console.log(`- ${role.name}: ${Object.keys(Object.fromEntries(role.permissions)).length} permissions`);
    });

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error seeding roles:', error);
    process.exit(1);
  }
}

seedRoles();
