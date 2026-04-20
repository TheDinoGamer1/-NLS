import { z } from "zod";
import { SUPPORTED_MODELS } from "@/lib/models";

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(64),
  name: z.string().min(1).max(80).optional(),
});

export const createConversationSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  selectedModel: z.enum(SUPPORTED_MODELS).optional(),
});

export const updateConversationSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  selectedModel: z.enum(SUPPORTED_MODELS).optional(),
});

export const sendMessageSchema = z.object({
  conversationId: z.string().cuid(),
  content: z.string().min(1).max(15000),
  model: z.enum(SUPPORTED_MODELS),
  regenerateFromMessageId: z.string().cuid().optional(),
});

export const retryMessageSchema = z.object({
  messageId: z.string().cuid(),
});
