"use client";

import type { FileWithStatus } from "@/app/page";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Merge } from "lucide-react";

type MergeButtonProps = {
  files: FileWithStatus[];
  onMerge: () => void;
};

export function MergeButton({ files, onMerge }: MergeButtonProps) {
  const isMergeable =
    files.length >= 2 && files.every((f) => f.status === "viable");

  if (files.length < 1) {
    return null;
  }

  return (
    <div className="flex justify-center pt-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="lg" disabled={!isMergeable}>
            <Merge className="mr-2 h-5 w-5" />
            Merge {files.length} PDF{files.length !== 1 ? "s" : ""}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you ready to merge?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will combine {files.length} PDF files into a single
              document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onMerge}>Confirm & Merge</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
