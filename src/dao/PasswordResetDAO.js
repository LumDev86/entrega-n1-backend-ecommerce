import PasswordReset from "../models/passwordResetModel.js";

class PasswordResetDAO {
  async create(userId, token) {
    return await PasswordReset.create({
      user: userId,
      token,
      expiresAt: new Date(Date.now() + 3600000) // 1 hora
    });
  }

  async findByToken(token) {
    return await PasswordReset.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() }
    }).populate("user");
  }

  async markAsUsed(token) {
    return await PasswordReset.findOneAndUpdate(
      { token },
      { used: true },
      { new: true }
    );
  }

  async deleteByUserId(userId) {
    return await PasswordReset.deleteMany({ user: userId });
  }
}

export default new PasswordResetDAO();