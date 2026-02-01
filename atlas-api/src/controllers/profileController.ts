import { Request, Response } from "express";
import { UserService } from "../services";

interface AuthRequest extends Request {
  userId?: number;
}

export class ProfileController {
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = res.locals.userId;

      const profile = await UserService.getUserProfile(userId);
      if (!profile) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.json(profile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar perfil" });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = res.locals.userId;
      const { name, theme } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Nome é obrigatório" });
      }

      if (theme && theme !== "light" && theme !== "dark") {
        return res.status(400).json({ error: "Tema inválido" });
      }

      const user = await UserService.updateUser(userId, { name, theme });
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.json({
        user,
        message: "Perfil atualizado com sucesso",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar perfil" });
    }
  }

  static async changePassword(req: AuthRequest, res: Response) {
    try {
      const userId = res.locals.userId;
      const { currentPassword, newPassword } = req.body;
      const bcrypt = require("bcryptjs");
      const { UserRepository } = require("../repositories");

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Preencha todos os campos" });
      }

      const user = await UserRepository.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Senha atual inválida" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await UserService.changePassword(userId, hashedPassword);

      res.json({ message: "Senha alterada com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao alterar senha" });
    }
  }
}
