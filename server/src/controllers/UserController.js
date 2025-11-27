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
}

export default UserController;
