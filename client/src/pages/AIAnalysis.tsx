import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIInsightsGrid, type AIInsight } from "@/components/AIInsights";
import { ArrowLeft, Brain, Download, TrendingUp, Lightbulb, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function AIAnalysis({ projectId }: { projectId: number }) {
    const [, setLocation] = useLocation();
    const [activeTab, setActiveTab] = useState("overview");

    const analyzeProject = trpc.ai.analyzeProject.useMutation({
        onSuccess: () => {
            toast.success("Análisis completado");
        },
        onError: (error) => {
            toast.error("Error: " + error.message);
            if (error.message.includes("OPENAI_API_KEY")) {
                toast.error("Configure la API key para habilitar funciones de IA");
            }
        }
    });

    const getRecommendations = trpc.ai.getRecommendations.useMutation({
        onSuccess: () => {
            toast.success("Recomendaciones generadas");
        },
        onError: (error) => toast.error("Error: " + error.message)
    });

    const generateForecast = trpc.ai.generateForecast.useMutation({
        onSuccess: () => {
            toast.success("Pronóstico generado");
        },
        onError: (error) => toast.error("Error: " + error.message)
    });

    const generateReport = trpc.ai.generateReport.useMutation({
        onSuccess: () => {
            toast.success("Reporte generado");
        },
        onError: (error) => toast.error("Error: " + error.message)
    });

    const handleAnalyze = () => {
        analyzeProject.mutate({ projectId });
    };

    const handleGetRecommendations = () => {
        getRecommendations.mutate({ projectId });
    };

    const handleGenerateForecast = () => {
        generateForecast.mutate({ projectId });
    };

    const handleGenerateReport = () => {
        generateReport.mutate({ projectId });
    };

    const handleDownloadReport = () => {
        if (generateReport.data?.report) {
            const blob = new Blob([generateReport.data.report], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `executive-report-${projectId}-${new Date().toISOString().split('T')[0]}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success("Reporte descargado");
        }
    };

    const isLoading = analyzeProject.isPending || getRecommendations.isPending ||
        generateForecast.isPending || generateReport.isPending;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        onClick={() => setLocation(`/project/${projectId}`)}
                        className="pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-foreground mb-2"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Proyecto
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 p-3 rounded-xl">
                            <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Análisis con IA</h1>
                            <p className="text-muted-foreground">Insights inteligentes para tu modelo financiero</p>
                        </div>
                    </div>
                </div>
                <Button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                    {analyzeProject.isPending ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Analizando...
                        </>
                    ) : (
                        <>
                            <Brain className="mr-2 h-4 w-4" />
                            Generar Análisis Completo
                        </>
                    )}
                </Button>
            </div>

            {/* Health Score Card */}
            {analyzeProject.data && (
                <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-900">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Salud Financiera del Proyecto</span>
                            <div className="flex items-center gap-2">
                                <span className="text-4xl font-bold text-purple-700 dark:text-purple-300">
                                    {analyzeProject.data.healthScore}
                                </span>
                                <span className="text-sm text-muted-foreground">/100</span>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{analyzeProject.data.summary}</p>
                        {analyzeProject.data.metrics && Object.keys(analyzeProject.data.metrics).length > 0 && (
                            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {analyzeProject.data.metrics.monthlyBurnRate && (
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Burn Rate Mensual</p>
                                        <p className="text-sm font-semibold">
                                            ${(analyzeProject.data.metrics.monthlyBurnRate / 100).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                                {analyzeProject.data.metrics.breakEvenMonth && (
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Break-Even</p>
                                        <p className="text-sm font-semibold">Mes {analyzeProject.data.metrics.breakEvenMonth}</p>
                                    </div>
                                )}
                                {analyzeProject.data.metrics.profitMargin !== undefined && (
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Margen de Ganancia</p>
                                        <p className="text-sm font-semibold">
                                            {(analyzeProject.data.metrics.profitMargin * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                )}
                                {analyzeProject.data.metrics.debtToEquityRatio !== undefined && (
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Deuda/Capital</p>
                                        <p className="text-sm font-semibold">
                                            {analyzeProject.data.metrics.debtToEquityRatio.toFixed(2)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Resumen
                    </TabsTrigger>
                    <TabsTrigger value="recommendations" className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Recomendaciones
                    </TabsTrigger>
                    <TabsTrigger value="forecast" className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Pronósticos
                    </TabsTrigger>
                    <TabsTrigger value="reports" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Reportes
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Análisis General</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {analyzeProject.data ? (
                                <AIInsightsGrid insights={analyzeProject.data.insights} />
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Haz clic en "Generar Análisis Completo" para obtener insights con IA</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Optimización de Costos</h2>
                        <Button
                            onClick={handleGetRecommendations}
                            disabled={isLoading}
                            variant="outline"
                        >
                            {getRecommendations.isPending ? "Generando..." : "Generar Recomendaciones"}
                        </Button>
                    </div>
                    <Card>
                        <CardContent className="pt-6">
                            {getRecommendations.data ? (
                                <AIInsightsGrid insights={getRecommendations.data} />
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Genera recomendaciones de optimización de costos con IA</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="forecast" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Pronóstico de Ingresos</h2>
                        <Button
                            onClick={handleGenerateForecast}
                            disabled={isLoading}
                            variant="outline"
                        >
                            {generateForecast.isPending ? "Generando..." : "Generar Pronóstico"}
                        </Button>
                    </div>
                    {generateForecast.data ? (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Proyección 12 Meses</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {generateForecast.data.forecast.map((month) => (
                                            <div key={month.month} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                                <span className="text-sm font-medium">Mes {month.month}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-semibold">
                                                        ${(month.revenue / 100).toLocaleString()}
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded ${month.confidence === 'high' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                            month.confidence === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                                                                'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                                        }`}>
                                                        {month.confidence}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Insights del Pronóstico</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <AIInsightsGrid insights={generateForecast.data.insights} />
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Genera pronósticos de ingresos basados en IA</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="reports" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Reporte Ejecutivo</h2>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleGenerateReport}
                                disabled={isLoading}
                                variant="outline"
                            >
                                {generateReport.isPending ? "Generando..." : "Generar Reporte"}
                            </Button>
                            {generateReport.data && (
                                <Button onClick={handleDownloadReport} variant="default">
                                    <Download className="mr-2 h-4 w-4" />
                                    Descargar
                                </Button>
                            )}
                        </div>
                    </div>
                    {generateReport.data ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Reporte Generado por IA</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose dark:prose-invert max-w-none">
                                    <pre className="whitespace-pre-wrap text-sm bg-muted/30 p-4 rounded-lg">
                                        {generateReport.data.report}
                                    </pre>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Genera un reporte ejecutivo completo con insights de IA</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
