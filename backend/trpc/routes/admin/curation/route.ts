import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { CuratedArticleSubmission } from "@/types/admin";
import { Article } from "@/types/news";

// In-memory curated submissions
let curatedSubmissions: CuratedArticleSubmission[] = [];
let articlesStore: Article[] = [];

export const getCuratedSubmissions = protectedProcedure
  .input(
    z
      .object({
        status: z.enum(["all", "pending", "approved", "rejected"]).optional().default("all"),
        limit: z.number().min(1).max(100).optional().default(20),
        offset: z.number().min(0).optional().default(0),
      })
      .optional()
  )
  .query(({ input }) => {
    let filtered = [...curatedSubmissions];

    if (input?.status && input.status !== "all") {
      filtered = filtered.filter((s) => s.status === input.status);
    }

    const total = filtered.length;
    const submissions = filtered.slice(
      input?.offset || 0,
      (input?.offset || 0) + (input?.limit || 20)
    );

    return {
      submissions,
      total,
      hasMore: (input?.offset || 0) + submissions.length < total,
    };
  });

export const submitCuratedArticle = protectedProcedure
  .input(
    z.object({
      title: z.string().min(1),
      excerpt: z.string().min(1),
      content: z.string().min(1),
      category: z.string(),
      sourceId: z.string().optional(),
      externalUrl: z.string().url().optional(),
      imageUrl: z.string().url().optional(),
      tags: z.array(z.string()).optional(),
    })
  )
  .mutation(({ input, ctx }) => {
    const submission: CuratedArticleSubmission = {
      id: `curated-${Date.now()}`,
      ...input,
      submittedBy: ctx.userId || "unknown",
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    curatedSubmissions.push(submission);
    return submission;
  });

export const reviewCuratedSubmission = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      action: z.enum(["approve", "reject"]),
      notes: z.string().optional(),
    })
  )
  .mutation(({ input, ctx }) => {
    const submission = curatedSubmissions.find((s) => s.id === input.id);
    if (!submission) throw new Error("Submission not found");

    submission.status = input.action === "approve" ? "approved" : "rejected";
    submission.reviewedBy = ctx.userId;
    submission.reviewedAt = new Date().toISOString();
    submission.notes = input.notes;

    // If approved, create article
    if (input.action === "approve") {
      const article: Article = {
        id: `article-${Date.now()}`,
        sourceId: submission.sourceId || "curated",
        sourceName: "Curated Content",
        source: "Curated Content",
        category: submission.category,
        title: submission.title,
        excerpt: submission.excerpt,
        summary: submission.excerpt,
        canonicalUrl: submission.externalUrl || "",
        imageUrl: submission.imageUrl || "",
        publishedAt: new Date().toISOString(),
        importedAt: new Date().toISOString(),
        status: "published",
        viewCount: 0,
        tags: submission.tags,
        isPremium: true, // Curated articles are premium
      };

      articlesStore.push(article);
    }

    return { success: true, submission };
  });

export const updateCuratedSubmission = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      title: z.string().optional(),
      excerpt: z.string().optional(),
      content: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
    })
  )
  .mutation(({ input }) => {
    const submission = curatedSubmissions.find((s) => s.id === input.id);
    if (!submission) throw new Error("Submission not found");

    Object.assign(submission, input);
    return { success: true, submission };
  });

export const deleteCuratedSubmission = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(({ input }) => {
    const index = curatedSubmissions.findIndex((s) => s.id === input.id);
    if (index === -1) throw new Error("Submission not found");
    curatedSubmissions.splice(index, 1);
    return { success: true };
  });

