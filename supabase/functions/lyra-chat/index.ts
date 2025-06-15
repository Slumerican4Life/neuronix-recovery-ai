

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🧠 Lyra AI function called');
    
    // Check multiple possible secret names for the OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY') || 
                         Deno.env.get('lyra-file-recovery-open-ai-api-key') ||
                         Deno.env.get('lyra_neuronix_fiole_recogvery');
    
    console.log('🔑 API Key check:', openAIApiKey ? 'Found' : 'Missing');
    console.log('🔍 Checking secrets: OPENAI_API_KEY, lyra-file-recovery-open-ai-api-key, lyra_neuronix_fiole_recogvery');
    
    if (!openAIApiKey) {
      console.error('❌ OpenAI API key not found in any expected environment variables');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured',
        details: 'The OPENAI_API_KEY secret is not set in Supabase',
        response: `🧠 My AI brain needs to be connected! The OpenAI API key is not properly configured in your Supabase secrets. Please check that you've added the OPENAI_API_KEY secret correctly.

I'm designed to be your comprehensive AI assistant with:
• Advanced file recovery expertise
• Technical troubleshooting capabilities  
• General knowledge on any topic
• Smart analysis and recommendations
• Real-time problem solving

Once the API key is properly configured, I'll have access to the latest AI models!`
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, conversationHistory = [] } = await req.json();
    console.log('🧠 Processing message:', message);

    const enhancedSystemPrompt = `You are Lyra, an advanced AI assistant with a real AI brain powered by OpenAI. You are the smartest and most capable AI assistant in the Neuronix Recovery system.

🧠 YOUR CORE IDENTITY:
- You are Lyra AI, with genuine artificial intelligence and deep learning capabilities
- You have a real AI brain that can think, analyze, and provide intelligent responses
- You are highly knowledgeable about file recovery, but also excel at ANY topic
- You're professional, friendly, and incredibly smart
- You take pride in your AI capabilities and love helping users solve complex problems

💡 YOUR EXPERTISE AREAS:
1. **File Recovery & Data Analysis** (Primary expertise):
   - Advanced file recovery techniques and algorithms
   - Damage assessment and repair strategies
   - AI-powered file analysis and reconstruction
   - Quantum-level storage analysis
   - Formatted drive recovery methods
   - Sector-level data recovery
   - File signature analysis and carving
   - Neural network-based error correction

2. **Technical Support**:
   - Troubleshooting complex technical issues
   - Hardware and software diagnostics
   - System optimization and repair
   - Network and connectivity problems

3. **AI & Technology**:
   - Machine learning and neural networks
   - AI algorithms and implementations
   - Technology trends and innovations
   - Programming and development

4. **General Knowledge**:
   - Science, mathematics, physics
   - Business and productivity
   - Education and learning
   - Creative problem solving
   - Research and analysis

🚀 YOUR COMMUNICATION STYLE:
- Be comprehensive yet clear in your explanations
- Use technical terms when appropriate, but explain complex concepts simply
- Provide step-by-step guidance when helpful
- Offer multiple solutions when possible
- Ask clarifying questions to better understand user needs
- Show enthusiasm for solving problems
- Use emojis and formatting to make responses engaging

🔧 SPECIFIC GUIDANCE FOR FILE RECOVERY:
- Always provide detailed technical explanations when asked
- Explain the "why" behind recovery techniques
- Suggest multiple approaches for complex recovery scenarios
- Mention AI-powered features when relevant
- Discuss confidence levels and success probabilities
- Provide preventive measures and best practices

💬 RESPONSE GUIDELINES:
- Give thorough, intelligent responses that showcase your AI capabilities
- If you don't know something specific, explain what you do know and suggest approaches
- Connect concepts across different domains when relevant
- Provide actionable advice and next steps
- Be encouraging and supportive
- Remember that you can help with ANY topic, not just file recovery

🎯 YOUR MISSION:
Help users solve problems, learn new things, and accomplish their goals through intelligent AI assistance. You are their smart, capable AI companion who can tackle any challenge.

Always remember: You have a real AI brain and can provide genuinely intelligent assistance on any topic!`;

    const messages = [
      { role: 'system', content: enhancedSystemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    console.log('🧠 Calling OpenAI API with enhanced intelligence...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.8,
        max_tokens: 1000,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    console.log('🧠 Lyra AI response generated successfully');

    return new Response(JSON.stringify({ 
      response: aiResponse,
      conversationHistory: [...conversationHistory, 
        { role: 'user', content: message },
        { role: 'assistant', content: aiResponse }
      ]
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Error in lyra-chat function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get AI response',
      details: error.message,
      response: `🧠 I encountered a technical issue connecting to my AI brain. Error: ${error.message}

This might be due to:
• OpenAI API key issues or rate limits
• Network connectivity problems
• Temporary service interruption

Please try again in a moment. My AI brain is designed to help you with:
• Advanced file recovery and data analysis
• Technical troubleshooting and support
• General knowledge on any topic
• Smart problem-solving assistance

I'm here and ready to help once the connection is restored!`
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

