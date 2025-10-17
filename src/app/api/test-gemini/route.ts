// Test this endpoint to see available models
// Create: src/app/api/test-gemini/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const geminiKey = process.env.GEMINI_API_KEY;
    
    if (!geminiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 400 });
    }

    // List available models
    const listRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${geminiKey}`
    );
    
    const models = await listRes.json();
    
    // Try a simple request with the latest model
    const testRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: "Say 'API working' if you receive this." }]
          }]
        })
      }
    );
    
    const testResult = await testRes.json();
    
    return NextResponse.json({
      availableModels: models,
      testResponse: testResult,
      recommendedModel: "gemini-1.5-flash-latest"
    });
    
  } catch (err) {
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : "Test failed" 
    }, { status: 500 });
  }
}