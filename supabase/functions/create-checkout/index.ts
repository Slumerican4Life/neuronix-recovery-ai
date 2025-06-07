
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { priceId, userId, isLifetime = false } = await req.json();
    
    const stripeKey = Deno.env.get('Stripe-ai-file-Recovery-stripe-key');
    if (!stripeKey) {
      throw new Error('Stripe API key not configured');
    }

    // Create Stripe checkout session
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[]': 'card',
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        'mode': isLifetime ? 'payment' : 'subscription',
        'success_url': `${req.headers.get('origin') || 'https://your-app.com'}/success?session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${req.headers.get('origin') || 'https://your-app.com'}/`,
        'client_reference_id': userId,
        'metadata[user_id]': userId,
        'metadata[plan_type]': isLifetime ? 'lifetime' : 'monthly',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Stripe API error: ${error}`);
    }

    const session = await response.json();

    return new Response(JSON.stringify({ 
      sessionId: session.id,
      checkoutUrl: session.url 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create checkout session',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
