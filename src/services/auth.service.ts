import { users } from "@/data/users";
import { delay } from "@/lib/utils";
import type { LoginCredentials, LoginResponse, User } from "@/types";

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await delay(800);

    const user = users.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return {
        success: false,
        message: "Email atau password salah.",
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        message: "Akun Anda tidak aktif. Hubungi administrator.",
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
    };
  }

  static async logout(): Promise<void> {
    await delay(300);
  }

  static async getCurrentUser(userId: string): Promise<Omit<User, "password"> | null> {
    await delay(300);

    const user = users.find((u) => u.id === userId);
    if (!user) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
