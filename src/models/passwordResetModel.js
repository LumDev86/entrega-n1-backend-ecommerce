import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    token: {
      type: String,
      required: true,
      unique: true
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 3600000) // 1 hora
    },
    used: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Índice para eliminar tokens expirados automáticamente
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordReset = mongoose.model("PasswordReset", passwordResetSchema);

export default PasswordReset;