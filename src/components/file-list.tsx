"use client";

import type { FileWithStatus } from "@/app/merger/page";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

type FileListProps = {
  files: FileWithStatus[];
  onRemoveFile: (id: string) => void;
};

const StatusIcon = ({
  status,
  preflight,
}: {
  status: FileWithStatus["status"];
  preflight?: FileWithStatus["preflight"];
}) => {
  switch (status) {
    case "checking":
      return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
    case "viable":
      return <CheckCircle2 className="h-5 w-5 text-success" />;
    case "error":
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AlertCircle className="h-5 w-5 text-destructive" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold">{preflight?.issue}</p>
              <p>{preflight?.suggestion}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    default:
      return null;
  }
};

export function FileList({ files, onRemoveFile }: FileListProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          Uploaded Files
        </h2>
        <ScrollArea className="h-64">
          <ul className="space-y-3 pr-4">
            {files.map(({ file, id, status, preflight }) => (
              <li
                key={id}
                className="flex items-center justify-between rounded-md border bg-card p-3 shadow-sm"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="h-6 w-6 flex-shrink-0 text-primary" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate font-medium text-sm text-foreground">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(file.size / 1024)} KB
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusIcon status={status} preflight={preflight} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => onRemoveFile(id)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
