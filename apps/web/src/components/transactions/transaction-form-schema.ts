import { z } from "zod";
import {
  transactionTypeSchema,
  transactionCategorySchema,
  TransactionType,
} from "@/mock/types";

/**
 * Form-specific schema with custom validations
 */
export const transactionFormSchema = z
  .object({
    // Basic fields
    description: z
      .string()
      .min(2, "Description must be at least 2 characters")
      .max(60, "Description must be at most 60 characters")
      .refine((val) => val.trim().length > 0, "Description cannot be empty"),

    amount: z
      .number({
        required_error: "Amount is required",
        invalid_type_error: "Amount must be a number",
      })
      .positive("Amount must be greater than 0"),

    type: transactionTypeSchema,

    category: transactionCategorySchema,

    accountId: z.string().min(1, "Account is required"),

    // Date
    date: z.date(),

    // Transfer-specific fields
    toAccountId: z.string().optional(),

    // Optional notes
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      // For transfers, validate that source and destination accounts are different
      if (data.type === TransactionType.TRANSFER && data.toAccountId) {
        return data.accountId !== data.toAccountId;
      }
      return true;
    },
    {
      message: "Source and destination accounts must be different",
      path: ["toAccountId"],
    },
  )
  .refine(
    (data) => {
      // For expenses and transfers, date cannot be in the future
      if (
        data.type === TransactionType.EXPENSE ||
        data.type === TransactionType.TRANSFER
      ) {
        const now = new Date();
        now.setHours(23, 59, 59, 999); // End of today
        return data.date <= now;
      }
      return true;
    },
    {
      message: "Date cannot be in the future",
      path: ["date"],
    },
  );

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
