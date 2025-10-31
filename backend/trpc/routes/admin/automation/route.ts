import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { AutomationConfig } from "@/types/admin";

// In-memory automation configs
let automationConfigs: AutomationConfig[] = [
  {
    id: "auto-1",
    sourceId: "techcrunch",
    enabled: true,
    fetchInterval: 60, // 60 minutes
    autoPublish: false,
    requireModeration: true,
    filters: {
      categories: ["tech"],
      keywords: ["AI", "technology", "innovation"],
      excludeKeywords: ["sponsored"],
      minTrustScore: 70,
    },
    lastRun: new Date(Date.now() - 3600000).toISOString(),
    nextRun: new Date(Date.now() + 3300000).toISOString(),
    articlesFetched: 15,
  },
];

export const getAutomationConfigs = protectedProcedure.query(() => {
  return automationConfigs;
});

export const getAutomationConfig = protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(({ input }) => {
    const config = automationConfigs.find((c) => c.id === input.id);
    if (!config) throw new Error("Automation config not found");
    return config;
  });

export const createAutomationConfig = protectedProcedure
  .input(
    z.object({
      sourceId: z.string(),
      enabled: z.boolean().default(true),
      fetchInterval: z.number().min(1).max(1440), // 1 minute to 24 hours
      autoPublish: z.boolean().default(false),
      requireModeration: z.boolean().default(true),
      filters: z
        .object({
          categories: z.array(z.string()).optional(),
          keywords: z.array(z.string()).optional(),
          excludeKeywords: z.array(z.string()).optional(),
          minTrustScore: z.number().min(0).max(100).optional(),
        })
        .optional(),
    })
  )
  .mutation(({ input }) => {
    const config: AutomationConfig = {
      id: `auto-${Date.now()}`,
      ...input,
      filters: input.filters || {},
      nextRun: new Date(Date.now() + input.fetchInterval * 60000).toISOString(),
    };

    automationConfigs.push(config);
    return config;
  });

export const updateAutomationConfig = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      enabled: z.boolean().optional(),
      fetchInterval: z.number().min(1).max(1440).optional(),
      autoPublish: z.boolean().optional(),
      requireModeration: z.boolean().optional(),
      filters: z
        .object({
          categories: z.array(z.string()).optional(),
          keywords: z.array(z.string()).optional(),
          excludeKeywords: z.array(z.string()).optional(),
          minTrustScore: z.number().min(0).max(100).optional(),
        })
        .optional(),
    })
  )
  .mutation(({ input }) => {
    const config = automationConfigs.find((c) => c.id === input.id);
    if (!config) throw new Error("Automation config not found");

    Object.assign(config, {
      ...input,
      filters: input.filters ? { ...config.filters, ...input.filters } : config.filters,
    });

    if (input.fetchInterval && config.enabled) {
      config.nextRun = new Date(Date.now() + input.fetchInterval * 60000).toISOString();
    }

    return config;
  });

export const deleteAutomationConfig = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(({ input }) => {
    const index = automationConfigs.findIndex((c) => c.id === input.id);
    if (index === -1) throw new Error("Automation config not found");
    automationConfigs.splice(index, 1);
    return { success: true };
  });

export const runAutomation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(({ input }) => {
    const config = automationConfigs.find((c) => c.id === input.id);
    if (!config) throw new Error("Automation config not found");

    // Simulate automation run
    config.lastRun = new Date().toISOString();
    config.nextRun = new Date(Date.now() + config.fetchInterval * 60000).toISOString();
    config.articlesFetched = (config.articlesFetched || 0) + Math.floor(Math.random() * 10) + 5;

    return {
      success: true,
      articlesFetched: config.articlesFetched,
      lastRun: config.lastRun,
    };
  });

