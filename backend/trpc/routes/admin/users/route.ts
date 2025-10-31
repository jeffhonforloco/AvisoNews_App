import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { AdminUser, AdminRole } from "@/types/admin";

// In-memory admin users
let adminUsers: AdminUser[] = [
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
    permissions: ["manage_articles", "moderate_content", "publish_articles", "delete_articles"],
    createdAt: new Date().toISOString(),
    active: true,
  },
  {
    id: "moderator-1",
    email: "moderator@avisonews.com",
    name: "Content Moderator",
    role: "moderator",
    permissions: ["moderate_content", "view_analytics"],
    createdAt: new Date().toISOString(),
    active: true,
  },
];

const rolePermissions: Record<AdminRole, string[]> = {
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
  editor: ["manage_articles", "moderate_content", "publish_articles", "delete_articles"],
  moderator: ["moderate_content", "view_analytics"],
  curator: ["manage_articles", "publish_articles"],
};

export const getUsers = protectedProcedure
  .input(
    z
      .object({
        role: z.enum(["super_admin", "admin", "editor", "moderator", "curator"]).optional(),
        active: z.boolean().optional(),
        search: z.string().optional(),
        limit: z.number().min(1).max(100).optional().default(20),
        offset: z.number().min(0).optional().default(0),
      })
      .optional()
  )
  .query(({ input }) => {
    let filtered = [...adminUsers];

    if (input?.role) {
      filtered = filtered.filter((u) => u.role === input.role);
    }

    if (input?.active !== undefined) {
      filtered = filtered.filter((u) => u.active === input.active);
    }

    if (input?.search) {
      const searchLower = input.search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower)
      );
    }

    const total = filtered.length;
    const users = filtered.slice(
      input?.offset || 0,
      (input?.offset || 0) + (input?.limit || 20)
    );

    return {
      users,
      total,
      hasMore: (input?.offset || 0) + users.length < total,
    };
  });

export const getUser = protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(({ input }) => {
    const user = adminUsers.find((u) => u.id === input.id);
    if (!user) throw new Error("User not found");
    return user;
  });

export const createUser = protectedProcedure
  .input(
    z.object({
      email: z.string().email(),
      name: z.string().min(1),
      role: z.enum(["super_admin", "admin", "editor", "moderator", "curator"]),
      active: z.boolean().default(true),
    })
  )
  .mutation(({ input }) => {
    const existingUser = adminUsers.find((u) => u.email === input.email);
    if (existingUser) throw new Error("User with this email already exists");

    const user: AdminUser = {
      id: `user-${Date.now()}`,
      email: input.email,
      name: input.name,
      role: input.role,
      permissions: rolePermissions[input.role] as any,
      createdAt: new Date().toISOString(),
      active: input.active,
    };

    adminUsers.push(user);
    return user;
  });

export const updateUser = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string().optional(),
      role: z.enum(["super_admin", "admin", "editor", "moderator", "curator"]).optional(),
      active: z.boolean().optional(),
      permissions: z.array(z.string()).optional(),
    })
  )
  .mutation(({ input }) => {
    const user = adminUsers.find((u) => u.id === input.id);
    if (!user) throw new Error("User not found");

    if (input.role && input.role !== user.role) {
      user.role = input.role;
      user.permissions = rolePermissions[input.role] as any;
    }

    if (input.name) user.name = input.name;
    if (input.active !== undefined) user.active = input.active;
    if (input.permissions) user.permissions = input.permissions as any;

    return user;
  });

export const deleteUser = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(({ input }) => {
    if (input.id === "admin-1") {
      throw new Error("Cannot delete super admin");
    }

    const index = adminUsers.findIndex((u) => u.id === input.id);
    if (index === -1) throw new Error("User not found");
    adminUsers.splice(index, 1);
    return { success: true };
  });

