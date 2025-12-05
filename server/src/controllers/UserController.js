import UserDAO from "../daos/UserDAO.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserController {
  constructor() {
    this.userDAO = new UserDAO();
  }

  // Registro
  async register(req, res, next) {
    try {
      const { name, lastname, email, password, role } = req.body;

      if (!name || !lastname || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required: name, lastname, email, password"
        });
      }

      if (name.trim().length < 1) {
        return res.status(400).json({
          success: false,
          message: "Name must be at least 1 character long"
        });
      }

      if (lastname.trim().length < 1) {
        return res.status(400).json({
          success: false,
          message: "Last name must be at least 1 character long"
        });
      }

      if (!email.includes("@")) {
        return res.status(400).json({
          success: false,
          message: "A valid email is required"
        });
      }

      if (password.length < 5) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 5 characters long"
        });
      }

      const result = await this.userDAO.createUser({
        name: name.trim(),
        lastname: lastname.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: role || "ejecutivo"
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          id: result.user._id,
          name: result.user.name,
          lastname: result.user.lastname,
          email: result.user.email,
          role: result.user.role,
          createdAt: result.user.createdAt
        }
      });

    } catch (error) {
      console.error("Error in register:", error);
      next(error);
    }
  }

  // Login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required"
        });
      }

      const result = await this.userDAO.findByEmail(email);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const user = result.user;

      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      // Crear Token para controlar acceso (solo de 1 dia)
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          role: user.role
        }
      });

    } catch (error) {
      console.error("Error in login:", error);
      next(error);
    }
  }

  // get user by id
  async getUser(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this.userDAO.getUserById(id);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: result.user._id,
          name: result.user.name,
          lastname: result.user.lastname,
          email: result.user.email,
          role: result.user.role,
          createdAt: result.user.createdAt
        }
      });

    } catch (error) {
      console.error("Error in getUser:", error);
      next(error);
    }
  }

  // Get all users (manager only)
  async getAllUsers(req, res, next) {
    try {
      const result = await this.userDAO.getAllUsers();

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: result.error
        });
      }

      const users = result.users.map(user => ({
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }));

      return res.status(200).json({
        success: true,
        data: users
      });

    } catch (error) {
      console.error("Error in getAllUsers:", error);
      next(error);
    }
  }

  // Create user (manager only)
  async createUser(req, res, next) {
    try {
      const { name, lastname, email, password, role } = req.body;

      if (!name || !lastname || !email || !password || !role) {
        return res.status(400).json({
          success: false,
          message: "All fields are required: name, lastname, email, password, role"
        });
      }

      if (name.trim().length < 1) {
        return res.status(400).json({
          success: false,
          message: "Name must be at least 1 character long"
        });
      }

      if (lastname.trim().length < 1) {
        return res.status(400).json({
          success: false,
          message: "Last name must be at least 1 character long"
        });
      }

      if (!email.includes("@")) {
        return res.status(400).json({
          success: false,
          message: "A valid email is required"
        });
      }

      if (password.length < 5) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 5 characters long"
        });
      }

      if (!['ejecutivo', 'gerente'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role. Must be ejecutivo or gerente"
        });
      }

      const result = await this.userDAO.createUser({
        name: name.trim(),
        lastname: lastname.trim(),
        email: email.trim().toLowerCase(),
        password,
        role
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          id: result.user._id,
          name: result.user.name,
          lastname: result.user.lastname,
          email: result.user.email,
          role: result.user.role,
          createdAt: result.user.createdAt
        }
      });

    } catch (error) {
      console.error("Error in createUser:", error);
      next(error);
    }
  }

  // Update user role (manager only)
  async updateUserRole(req, res, next) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!userId || !role) {
        return res.status(400).json({
          success: false,
          message: "User ID and role are required"
        });
      }

      const result = await this.userDAO.updateUserRole(userId, role);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      return res.status(200).json({
        success: true,
        message: "User role updated successfully",
        data: {
          id: result.user._id,
          name: result.user.name,
          lastname: result.user.lastname,
          email: result.user.email,
          role: result.user.role,
          createdAt: result.user.createdAt
        }
      });

    } catch (error) {
      console.error("Error in updateUserRole:", error);
      next(error);
    }
  }

  // Delete user (manager only)
  async deleteUser(req, res, next) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required"
        });
      }

      const result = await this.userDAO.deleteUser(userId);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      return res.status(200).json({
        success: true,
        message: "User deleted successfully"
      });

    } catch (error) {
      console.error("Error in deleteUser:", error);
      next(error);
    }
  }
}

export default UserController;
