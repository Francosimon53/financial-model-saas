import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Lightbulb, TrendingUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type AIInsight = {
    type: 'risk' | 'opportunity' | 'recommendation' | 'highlight';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    actionable: boolean;
    suggestedAction?: string;
};

type AIInsightCardProps = {
    insight: AIInsight;
    className?: string;
};

const insightIcons = {
    risk: AlertTriangle,
    opportunity: Lightbulb,
    recommendation: TrendingUp,
    highlight: Sparkles,
};

const insightColors = {
    risk: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900",
    opportunity: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900",
    recommendation: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900",
    highlight: "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900",
};

const insightTextColors = {
    risk: "text-red-700 dark:text-red-300",
    opportunity: "text-green-700 dark:text-green-300",
    recommendation: "text-blue-700 dark:text-blue-300",
    highlight: "text-purple-700 dark:text-purple-300",
};

const impactBadgeColors = {
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    low: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

export function AIInsightCard({ insight, className }: AIInsightCardProps) {
    const Icon = insightIcons[insight.type];

    return (
        <Card className={cn(insightColors[insight.type], "transition-all hover:shadow-md", className)}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Icon className={cn("h-5 w-5", insightTextColors[insight.type])} />
                        <CardTitle className="text-base">{insight.title}</CardTitle>
                    </div>
                    <Badge variant="outline" className={impactBadgeColors[insight.impact]}>
                        {insight.impact} impact
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{insight.description}</p>
                {insight.actionable && insight.suggestedAction && (
                    <div className={cn("mt-3 p-3 rounded-md bg-background/50 border",
                        insight.type === 'risk' ? 'border-red-200 dark:border-red-900' :
                            insight.type === 'opportunity' ? 'border-green-200 dark:border-green-900' :
                                insight.type === 'recommendation' ? 'border-blue-200 dark:border-blue-900' :
                                    'border-purple-200 dark:border-purple-900'
                    )}>
                        <p className="text-xs font-medium text-foreground">Suggested Action:</p>
                        <p className="text-xs text-muted-foreground mt-1">{insight.suggestedAction}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

type AIInsightsGridProps = {
    insights: AIInsight[];
    loading?: boolean;
};

export function AIInsightsGrid({ insights, loading }: AIInsightsGridProps) {
    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader>
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="h-3 bg-muted rounded"></div>
                                <div className="h-3 bg-muted rounded w-5/6"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (insights.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No insights available yet.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {insights.map((insight, index) => (
                <AIInsightCard key={index} insight={insight} />
            ))}
        </div>
    );
}
