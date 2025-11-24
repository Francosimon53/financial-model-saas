// Quick test script to verify OpenAI API key is working
// Run with: node --loader ts-node/esm test-ai.mjs

import { invokeLLM } from './server/_core/llm.js';

async function testAI() {
    console.log('🧪 Testing AI API connection...\n');

    try {
        const result = await invokeLLM({
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'Say "Hello! AI is working correctly." in a friendly way.' }
            ]
        });

        console.log('✅ API Connection Successful!\n');
        console.log('Response:', result.choices[0].message.content);
        console.log('\n✨ Your OpenAI API key is configured correctly!');

    } catch (error) {
        console.error('❌ API Connection Failed:\n');
        console.error(error.message);
        console.log('\n💡 Possible issues:');
        console.log('  - Check that OPENAI_API_KEY is set in .env');
        console.log('  - Verify the API key is valid and has credits');
        console.log('  - Make sure you restarted the server after setting .env');
    }
}

testAI();
