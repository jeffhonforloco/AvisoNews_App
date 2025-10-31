import { z } from "zod";
import { publicProcedure, protectedProcedure } from "@/backend/trpc/create-context";
import { AdminUser, AdminRole, Permission } from "@/types/admin";

// Mock admin users (in production, use database)
const adminUsers: AdminUser[] = [
  {
    id: "admin-1",
    email: "admin@avisonews.com",
    name: "Super Admin",
    role: "super_admin",
    permissions: [
      "manage_users",
      "manage_articles",
      "manage_sources",
      "manage_categories",
      "moderate_content",
      "view_analytics",
      "manage_automation",
      "manage_settings",
      "publish_articles",
      "delete_articles",
      "edit_trust_scores",
    ],
    createdAt: new Date().toISOString(),
    active: true,
  },
  {
    id: "editor-1",
    email: "editor@avisonews.com",
    name: "News Editor",
    role: "editor",
    permissions: [
      "manage_articles",
      "moderate_content",
      "publish_articles",
      "delete_articles",
    ],
    createdAt: new Date().toISOString(),
    active: true,
  },
];

// Role permissions mapping
const rolePermissions: Record<AdminRole, Permission[]> = {
  super_admin: [
    "manage_users",
    "manage_articles",
    "manage_sources",
    "manage_categories",
    "moderate_content",
    "view_analytics",
    "manage_automation",
    "manage_settings",
    "publish_articles",
    "delete_articles",
    "edit_trust_scores",
  ],
  admin: [
    "manage_articles",
    "manage_sources",
    "manage_categories",
    "moderate_content",
    "view_analytics",
    "publish_articles",
    "delete_articles",
  ],
  editor: [
    "manage_articles",
    "moderate_content",
    "publish_articles",
    "delete_articles",
  ],
  moderator: ["moderate_content", "view_analytics"],
  curator: ["manage_articles", "publish_articles"],
};

export const login = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })
  )
  .mutation(({ input }) => {
    // In production, verify password hash
    const user = adminUsers.find(
      (u) => u.email === input.email && u.active
    );

    if (!user || input.password !== "admin123") {
      throw new Error("Invalid credentials");
    }

    // Update last login
    user.lastLoginAt = new Date().toISOString();

    // In production, generate JWT token
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions,
      },
      token: `mock_token_${user.id}`, // Replace with actual JWT
    };
  });

export const getCurrentAdmin = protectedProcedure.query(({ ctx }) => {
  // In production, get user from session/token
  const userId = ctx.userId || "admin-1";
  const user = adminUsers.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");
  return user;
});

export const checkPermission = protectedProcedure
  .input(z.object({ permission: z.string() }))
  .query(({ input, ctx }) => {
    const userId = ctx.userId || "admin-1";
    const user = adminUsers.find((u) => u.id === userId);
    if (!user) return { hasPermission: false };
    return { hasPermission: user.permissions.includes(input.permission as Permission) };
  });

