import UserDAO from '../daos/UserDAO.js';

const userDAO = new UserDAO();

const extractUserId = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Missing x-user-id header. Please configure VITE_USER_ID in your .env file'
      });
    }

    const result = await userDAO.getUserById(userId);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.error
      });
    }

    req.userId = userId;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error validating user',
      error: error.message
    });
  }
};

export default extractUserId;