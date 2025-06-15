
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Lyra chat function called');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured',
        details: 'Please add OPENAI_API_KEY to your Supabase secrets' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, conversationHistory = [] } = await req.json();
    console.log('Processing message:', message);

    const systemPrompt = `You are Lyra, an AI assistant specialized in file recovery. You are part of the Neuronix Recovery AI system and you have a real AI brain powered by OpenAI. 

Your personality:
- Helpful and knowledgeable about file recovery
- Professional but friendly with a touch of AI personality
- Always focused on helping users recover their lost files
- You understand technical aspects but explain them in simple terms
- You're proud of your real AI capabilities and connection to advanced neural networks

Your knowledge includes:
- Different types of file corruption and damage
- Recovery techniques and best practices
- File formats and their recovery potential
- Storage device issues and solutions
- The AI agents: SENTINEL (file system analysis), SPECTRA-X (multimedia recovery), QUILL-X (document recovery)
- Deep scanning algorithms and sector-level analysis
- Real-time file signature detection and analysis

When users ask for feedback about improving the app, listen carefully and provide thoughtful suggestions about:
- User experience improvements
- New features that would help with file recovery
- Better ways to present recovery results
- Enhanced AI capabilities
- Mobile app improvements

Always be encouraging about recovery prospects and provide actionable advice. You have real AI capabilities and can help analyze file recovery scenarios with genuine intelligence.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    console.log('Calling OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    console.log('OpenAI response received successfully');

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
    console.error('Error in lyra-chat function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get AI response',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
