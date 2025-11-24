import { invokeLLM } from "./_core/llm";
import type { RevenueProduct, CogsItem, Salary, OpexItem, FixedExpense, CapexItem, FundingSource } from "../drizzle/schema";

export type AIInsight = {
    type: 'risk' | 'opportunity' | 'recommendation' | 'highlight';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    actionable: boolean;
    suggestedAction?: string;
};

export type AIAnalysisResult = {
    summary: string;
    healthScore: number; // 0-100
    insights: AIInsight[];
    metrics: {
        monthlyBurnRate?: number;
        breakEvenMonth?: number;
        profitMargin?: number;
        debtToEquityRatio?: number;
    };
};

export type ProjectDataForAI = {
    projectName: string;
    industry?: string;
    startDate: Date;
    endDate: Date;
    revenueProducts: RevenueProduct[];
    cogsItems: CogsItem[];
    salaries: Salary[];
    opexItems: OpexItem[];
    fixedExpenses: FixedExpense[];
    capexItems: CapexItem[];
    fundingSources: FundingSource[];
};

function formatCurrency(cents: number): string {
    return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

function prepareProjectSummary(data: ProjectDataForAI): string {
    const totalRevenue = data.revenueProducts.reduce((sum, p) => sum + (p.averagePrice * p.volume), 0);
    const totalCOGS = data.cogsItems.reduce((sum, c) => sum + c.amount, 0);
    const totalSalaries = data.salaries.reduce((sum, s) => sum + s.monthlyCost, 0);
    const totalOPEX = data.opexItems.filter(o => o.expenseType === 'fixed').reduce((sum, o) => sum + o.amount, 0);
    const totalFixedExpenses = data.fixedExpenses.filter(f => f.frequency === 'monthly').reduce((sum, f) => sum + f.amount, 0);
    const totalCAPEX = data.capexItems.reduce((sum, c) => sum + c.amount, 0);
    const totalFunding = data.fundingSources.reduce((sum, f) => sum + f.amount, 0);
    const totalEquity = data.fundingSources.filter(f => f.sourceType === 'equity').reduce((sum, f) => sum + f.amount, 0);
    const totalDebt = data.fundingSources.filter(f => f.sourceType === 'debt').reduce((sum, f) => sum + f.amount, 0);

    return `
Project: ${data.projectName}
Industry: ${data.industry || 'Not specified'}
Duration: ${data.startDate.toLocaleDateString()} to ${data.endDate.toLocaleDateString()}

REVENUE:
- Products: ${data.revenueProducts.length}
- Estimated Monthly Revenue: ${formatCurrency(totalRevenue)}

COSTS:
- COGS Items: ${data.cogsItems.length}, Total: ${formatCurrency(totalCOGS)}
- Personnel: ${data.salaries.length} positions, Monthly Payroll: ${formatCurrency(totalSalaries)}
- OPEX Items: ${data.opexItems.length}, Fixed Monthly: ${formatCurrency(totalOPEX)}
- Fixed Expenses: ${data.fixedExpenses.length}, Monthly: ${formatCurrency(totalFixedExpenses)}
- CAPEX: ${data.capexItems.length} investments, Total: ${formatCurrency(totalCAPEX)}

FUNDING:
- Total Funding: ${formatCurrency(totalFunding)}
- Equity: ${formatCurrency(totalEquity)}
- Debt: ${formatCurrency(totalDebt)}
- Debt-to-Equity Ratio: ${totalEquity > 0 ? (totalDebt / totalEquity).toFixed(2) : 'N/A'}
`;
}

export async function analyzeProjectFinancials(data: ProjectDataForAI): Promise<AIAnalysisResult> {
    const projectSummary = prepareProjectSummary(data);

    const prompt = `You are a senior financial analyst. Analyze the following business project and provide insights.

${projectSummary}

Provide a comprehensive financial analysis including:
1. Overall financial health assessment (0-100 score)
2. Key risks and opportunities
3. Actionable recommendations for improvement
4. Important metrics and ratios

Format your response as JSON with this structure:
{
  "summary": "Brief 2-3 sentence executive summary",
  "healthScore": 75,
  "insights": [
    {
      "type": "risk|opportunity|recommendation|highlight",
      "title": "Short title",
      "description": "Detailed explanation",
      "impact": "high|medium|low",
      "actionable": true,
      "suggestedAction": "Specific action to take (optional)"
    }
  ],
  "metrics": {
    "monthlyBurnRate": 50000,
    "breakEvenMonth": 12,
    "profitMargin": 0.25,
    "debtToEquityRatio": 0.5
  }
}

Provide 5-8 insights covering risks, opportunities, and recommendations. Be specific and actionable.`;

    try {
        const response = await invokeLLM({
            messages: [
                { role: "system", content: "You are an expert financial analyst specializing in startup and business financial modeling. Provide clear, actionable insights." },
                { role: "user", content: prompt }
            ],
            responseFormat: { type: "json_object" }
        });

        const content = response.choices[0]?.message?.content;
        if (typeof content === 'string') {
            const parsed = JSON.parse(content);
            return parsed as AIAnalysisResult;
        }

        throw new Error("Invalid response format from AI");
    } catch (error) {
        console.error("AI Analysis Error:", error);
        throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function generateCostOptimizationRecommendations(data: ProjectDataForAI): Promise<AIInsight[]> {
    const projectSummary = prepareProjectSummary(data);

    const prompt = `You are a cost optimization expert. Analyze this business's expenses and identify cost-saving opportunities.

${projectSummary}

Focus on:
- Overstaffing or inefficient personnel allocation
- High fixed costs that could be variable
- Unnecessary CAPEX investments
- OPEX items that seem excessive

Provide 3-5 specific, actionable cost optimization recommendations as JSON:
{
  "recommendations": [
    {
      "type": "recommendation",
      "title": "Short title",
      "description": "Detailed explanation of the cost issue",
      "impact": "high|medium|low",
      "actionable": true,
      "suggestedAction": "Specific steps to reduce this cost"
    }
  ]
}`;

    try {
        const response = await invokeLLM({
            messages: [
                { role: "system", content: "You are a business efficiency expert focused on cost optimization." },
                { role: "user", content: prompt }
            ],
            responseFormat: { type: "json_object" }
        });

        const content = response.choices[0]?.message?.content;
        if (typeof content === 'string') {
            const parsed = JSON.parse(content);
            return parsed.recommendations as AIInsight[];
        }

        throw new Error("Invalid response format from AI");
    } catch (error) {
        console.error("Cost Optimization Error:", error);
        throw new Error(`Cost optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function generateRevenueForecast(data: ProjectDataForAI): Promise<{
    forecast: Array<{ month: number; revenue: number; confidence: 'high' | 'medium' | 'low' }>;
    insights: AIInsight[];
}> {
    const projectSummary = prepareProjectSummary(data);

    const prompt = `You are a revenue forecasting expert. Predict future revenue for the next 12 months based on current products.

${projectSummary}

Consider:
- Product pricing and volume
- Seasonality factors
- Market trends for ${data.industry || 'this industry'}

Provide a 12-month forecast with confidence levels and insights as JSON:
{
  "forecast": [
    { "month": 1, "revenue": 100000, "confidence": "high" },
    ...12 months
  ],
  "insights": [
    {
      "type": "highlight|opportunity",
      "title": "Revenue trend insight",
      "description": "Explanation",
      "impact": "high|medium|low",
      "actionable": true,
      "suggestedAction": "How to improve revenue"
    }
  ]
}`;

    try {
        const response = await invokeLLM({
            messages: [
                { role: "system", content: "You are a financial forecasting expert specializing in revenue predictions." },
                { role: "user", content: prompt }
            ],
            responseFormat: { type: "json_object" }
        });

        const content = response.choices[0]?.message?.content;
        if (typeof content === 'string') {
            return JSON.parse(content);
        }

        throw new Error("Invalid response format from AI");
    } catch (error) {
        console.error("Forecast Generation Error:", error);
        throw new Error(`Forecast generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function generateExecutiveReport(data: ProjectDataForAI, analysis: AIAnalysisResult): Promise<string> {
    const projectSummary = prepareProjectSummary(data);

    const prompt = `You are writing an executive report for investors/stakeholders. Create a professional, well-structured report.

PROJECT DATA:
${projectSummary}

AI ANALYSIS RESULTS:
Health Score: ${analysis.healthScore}/100
Summary: ${analysis.summary}

Key Insights:
${analysis.insights.map(i => `- [${i.type.toUpperCase()}] ${i.title}: ${i.description}`).join('\n')}

Write a comprehensive executive report (500-700 words) with:
1. Executive Summary
2. Financial Overview
3. Key Findings and Insights
4. Recommendations
5. Conclusion

Use professional business language. Format in Markdown with headers, bullet points, and emphasis where appropriate.`;

    try {
        const response = await invokeLLM({
            messages: [
                { role: "system", content: "You are a professional business report writer." },
                { role: "user", content: prompt }
            ]
        });

        const content = response.choices[0]?.message?.content;
        if (typeof content === 'string') {
            return content;
        }

        throw new Error("Invalid response format from AI");
    } catch (error) {
        console.error("Report Generation Error:", error);
        throw new Error(`Report generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
