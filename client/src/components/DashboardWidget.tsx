import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GripVertical } from "lucide-react";
import { ReactNode } from "react";

interface DashboardWidgetProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
  isDragging?: boolean;
}

export function DashboardWidget({
  title,
  description,
  children,
  isDragging = false,
}: DashboardWidgetProps) {
  return (
    <Card className={`transition-all ${isDragging ? "opacity-50 rotate-2 scale-105" : ""}`}>
      <CardHeader className="cursor-move">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && <CardDescription className="mt-1">{description}</CardDescription>}
          </div>
          <GripVertical className="h-5 w-5 text-muted-foreground shrink-0" />
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
