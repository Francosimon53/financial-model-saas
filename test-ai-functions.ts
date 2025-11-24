#!/usr/bin/env tsx

/**
 * Test Script for AI Analysis Functions
 * 
 * This script tests all AI analysis functions directly without needing the UI.
 * Run with: npx tsx test-ai-functions.ts
 */

// Load environment variables from .env file
import 'dotenv/config';

import { analyzeProjectFinancials, generateCostOptimizationRecommendations, generateRevenueForecast, generateExecutiveReport, type ProjectDataForAI } from './server/ai-analysis';

// Sample project data for testing
const sampleProjectData: ProjectDataForAI = {
    projectName: "Test SaaS Startup",
    industry: "Technology",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    revenueProducts: [
        {
            id: 1,
            projectId: 1,
            name: "Basic Plan",
            averagePrice: 2900, // $29.00
            volume: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 2,
            projectId: 1,
            name: "Pro Plan",
            averagePrice: 9900, // $99.00
            volume: 50,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ],
    cogsItems: [
        {
            id: 1,
            projectId: 1,
            name: "Cloud Hosting",
            amount: 100000, // $1,000
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ],
    salaries: [
        {
            id: 1,
            projectId: 1,
            position: "CEO",
            monthlyCost: 1000000, // $10,000
            startMonth: 1,
            endMonth: 12,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 2,
            projectId: 1,
            position: "Developer",
            monthlyCost: 800000, // $8,000
            startMonth: 1,
            endMonth: 12,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ],
    opexItems: [
        {
            id: 1,
            projectId: 1,
            name: "Marketing",
            expenseType: "fixed",
            amount: 300000, // $3,000
            percentageOfRevenue: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ],
    fixedExpenses: [
        {
            id: 1,
            projectId: 1,
            name: "Office Rent",
            amount: 200000, // $2,000
            frequency: "monthly",
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ],
    capexItems: [
        {
            id: 1,
            projectId: 1,
            name: "Servers",
            amount: 5000000, // $50,000
            month: 1,
            paymentDelay: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ],
    fundingSources: [
        {
            id: 1,
            projectId: 1,
            name: "Seed Round",
            sourceType: "equity",
            amount: 50000000, // $500,000
            month: 1,
            interestRate: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ]
};

async function runTests() {
    console.log('🧪 Testing AI Analysis Functions\n');
    console.log('='.repeat(60));
    console.log('\n📊 Sample Project Data:');
    console.log(`  Project: ${sampleProjectData.projectName}`);
    console.log(`  Industry: ${sampleProjectData.industry}`);
    console.log(`  Revenue Products: ${sampleProjectData.revenueProducts.length}`);
    console.log(`  Team Members: ${sampleProjectData.salaries.length}`);
    console.log(`  Funding: $${(sampleProjectData.fundingSources.reduce((s, f) => s + f.amount, 0) / 100).toLocaleString()}`);
    console.log('\n' + '='.repeat(60));

    // Test 1: Financial Analysis
    console.log('\n\n🧠 Test 1: Financial Health Analysis');
    console.log('-'.repeat(60));
    try {
        const analysis = await analyzeProjectFinancials(sampleProjectData);
        console.log('✅ Success!');
        console.log(`\n📈 Health Score: ${analysis.healthScore}/100`);
        console.log(`\n💡 Summary:\n${analysis.summary}`);
        console.log(`\n📊 Insights Found: ${analysis.insights.length}`);
        analysis.insights.forEach((insight, i) => {
            console.log(`\n  ${i + 1}. [${insight.type.toUpperCase()}] ${insight.title}`);
            console.log(`     Impact: ${insight.impact}`);
        });
        if (analysis.metrics) {
            console.log('\n📈 Key Metrics:');
            if (analysis.metrics.monthlyBurnRate) {
                console.log(`  • Monthly Burn Rate: $${(analysis.metrics.monthlyBurnRate / 100).toLocaleString()}`);
            }
            if (analysis.metrics.breakEvenMonth) {
                console.log(`  • Break-Even Month: ${analysis.metrics.breakEvenMonth}`);
            }
            if (analysis.metrics.profitMargin !== undefined) {
                console.log(`  • Profit Margin: ${(analysis.metrics.profitMargin * 100).toFixed(1)}%`);
            }
        }
    } catch (error) {
        console.error('❌ Failed:', error instanceof Error ? error.message : error);
    }

    // Test 2: Cost Optimization
    console.log('\n\n💡 Test 2: Cost Optimization Recommendations');
    console.log('-'.repeat(60));
    try {
        const recommendations = await generateCostOptimizationRecommendations(sampleProjectData);
        console.log('✅ Success!');
        console.log(`\n📋 Recommendations Found: ${recommendations.length}`);
        recommendations.forEach((rec, i) => {
            console.log(`\n  ${i + 1}. ${rec.title}`);
            console.log(`     Impact: ${rec.impact}`);
            if (rec.suggestedAction) {
                console.log(`     Action: ${rec.suggestedAction}`);
            }
        });
    } catch (error) {
        console.error('❌ Failed:', error instanceof Error ? error.message : error);
    }

    // Test 3: Revenue Forecast
    console.log('\n\n📈 Test 3: Revenue Forecasting');
    console.log('-'.repeat(60));
    try {
        const forecast = await generateRevenueForecast(sampleProjectData);
        console.log('✅ Success!');
        console.log('\n📊 12-Month Forecast:');
        forecast.forecast.forEach((month) => {
            console.log(`  Month ${month.month.toString().padStart(2, ' ')}: $${(month.revenue / 100).toLocaleString().padStart(10)} (${month.confidence} confidence)`);
        });
        console.log(`\n💡 Forecast Insights: ${forecast.insights.length}`);
    } catch (error) {
        console.error('❌ Failed:', error instanceof Error ? error.message : error);
    }

    // Test 4: Executive Report
    console.log('\n\n📄 Test 4: Executive Report Generation');
    console.log('-'.repeat(60));
    try {
        // First get analysis for the report
        const analysis = await analyzeProjectFinancials(sampleProjectData);
        const report = await generateExecutiveReport(sampleProjectData, analysis);
        console.log('✅ Success!');
        console.log(`\n📝 Report Length: ${report.length} characters`);
        console.log('\n--- EXECUTIVE REPORT ---\n');
        console.log(report);
        console.log('\n--- END REPORT ---');
    } catch (error) {
        console.error('❌ Failed:', error instanceof Error ? error.message : error);
    }

    console.log('\n\n' + '='.repeat(60));
    console.log('🎉 All Tests Completed!');
    console.log('='.repeat(60) + '\n');
}

// Run the tests
console.log('\n🚀 Starting AI Function Tests...\n');
runTests().catch((error) => {
    console.error('\n💥 Test suite failed:', error);
    process.exit(1);
});
