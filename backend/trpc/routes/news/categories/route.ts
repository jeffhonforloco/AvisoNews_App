import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { Category } from "@/types/news";

// Default categories
const defaultCategories: Category[] = [
  { id: "tech", name: "Technology", slug: "tech", color: "#0071E3" },
  { id: "business", name: "Business", slug: "business", color: "#30C86E" },
  { id: "world", name: "World", slug: "world", color: "#FF9500" },
  { id: "health", name: "Health", slug: "health", color: "#FF3B30" },
  { id: "gaming", name: "Gaming", slug: "gaming", color: "#5856D6" },
  { id: "science", name: "Science", slug: "science", color: "#00C7BE" },
  { id: "sports", name: "Sports", slug: "sports", color: "#FF6B35" },
  { id: "audio", name: "Audio", slug: "audio", color: "#AF52DE" },
  { id: "politics", name: "Politics", slug: "politics", color: "#8E8E93" },
  { id: "entertainment", name: "Entertainment", slug: "entertainment", color: "#FF2D55" },
  { id: "environment", name: "Environment", slug: "environment", color: "#34C759" },
];

export const getCategories = publicProcedure.query(() => {
  return defaultCategories;
});

export const getCategoryBySlug = publicProcedure
  .input(z.object({ slug: z.string() }))
  .query(({ input }) => {
    const category = defaultCategories.find((c) => c.slug === input.slug);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  });

