"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAccounts } from "@/hooks/accounts";
import { useCreateTransaction } from "@/hooks/transactions";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { CreateTransactionInput } from "@/mock/types";
import { TransactionForm } from "./transaction-form";
import type { TransactionFormValues } from "./transaction-form-schema";

interface CreateTransactionModalProps {
  children: React.ReactNode;
}

export function CreateTransactionModal({
  children,
}: CreateTransactionModalProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { data: accountsData, isLoading: accountsLoading } = useAccounts();
  const createTransaction = useCreateTransaction();

  const handleSubmit = async (values: TransactionFormValues) => {
    const input: CreateTransactionInput = {
      accountId: values.accountId,
      type: values.type,
      category: values.category,
      amount: values.amount,
      description: values.description,
      date: values.date,
      notes: values.notes,
    };

    await createTransaction.mutateAsync(input);
    setOpen(false);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-[480px] p-0 gap-0 overflow-hidden">
          <ModalContent
            accounts={accountsData?.accounts || []}
            accountsLoading={accountsLoading}
            onSubmit={handleSubmit}
            isSubmitting={createTransaction.isPending}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[70dvh] p-0 rounded-t-[32px] border-t-0"
      >
        <ModalContent
          accounts={accountsData?.accounts || []}
          accountsLoading={accountsLoading}
          onSubmit={handleSubmit}
          isSubmitting={createTransaction.isPending}
        />
      </SheetContent>
    </Sheet>
  );
}

interface ModalContentProps {
  accounts: any[];
  accountsLoading: boolean;
  onSubmit: (values: TransactionFormValues) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

function ModalContent({
  accounts,
  accountsLoading,
  onSubmit,
  isSubmitting,
}: Omit<ModalContentProps, "onClose">) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-center h-14 px-4 md:px-6 border-b shrink-0">
        <h2 className="text-sm font-medium text-muted-foreground">
          New Transaction
        </h2>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-4 md:pt-6">
        {accountsLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading accounts...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No accounts found</p>
          </div>
        ) : (
          <TransactionForm
            accounts={accounts}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
