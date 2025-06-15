
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Checkout function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured in Supabase secrets");
    }
    logStep("Stripe key verified");

    // Create Supabase client with service role for admin operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { priceId, userId, isLifetime, customerEmail } = await req.json();
    logStep("Request data parsed", { priceId, userId, isLifetime, customerEmail });

    if (!priceId || !userId || !customerEmail) {
      throw new Error("Missing required fields: priceId, userId, or customerEmail");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check if customer already exists
    const existingCustomers = await stripe.customers.list({ 
      email: customerEmail, 
      limit: 1 
    });
    
    let customerId;
    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      const newCustomer = await stripe.customers.create({
        email: customerEmail,
        metadata: {
          userId: userId,
          source: "ai-file-recovery"
        }
      });
      customerId = newCustomer.id;
      logStep("New customer created", { customerId });
    }

    // Enhanced pricing configuration
    const lifetimePriceConfig = {
      price_data: {
        currency: "usd",
        product_data: {
          name: "Neuronix AI File Recovery - Lifetime Access",
          description: "Unlimited AI-powered file recovery with all premium features",
          images: ["https://dvpeahnehnvofjzozmng.supabase.co/storage/v1/object/public/images/ai-brain-recovery.png"],
          metadata: {
            type: "lifetime",
            ai_agents: "SENTINEL,SPECTRA-X,QUILL-X",
            openai_integration: "true"
          }
        },
        unit_amount: 3999, // $39.99
      },
      quantity: 1,
    };

    const monthlyPriceConfig = {
      price_data: {
        currency: "usd",
        product_data: {
          name: "Neuronix AI File Recovery - Pro Monthly",
          description: "Monthly access to AI-powered file recovery system",
          images: ["https://dvpeahnehnvofjzozmng.supabase.co/storage/v1/object/public/images/ai-brain-recovery.png"],
          metadata: {
            type: "subscription",
            ai_agents: "SENTINEL,SPECTRA-X,QUILL-X",
            openai_integration: "true"
          }
        },
        unit_amount: 1999, // $19.99
        recurring: { interval: "month" },
      },
      quantity: 1,
    };

    const origin = req.headers.get("origin") || "https://neuronix-ai-recovery.lovable.app";
    
    // Create checkout session
    const sessionConfig = {
      customer: customerId,
      line_items: [isLifetime ? lifetimePriceConfig : monthlyPriceConfig],
      mode: isLifetime ? "payment" : "subscription",
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${origin}/?canceled=true`,
      automatic_tax: { enabled: true },
      customer_update: {
        address: "auto",
        name: "auto"
      },
      metadata: {
        userId: userId,
        planType: isLifetime ? "lifetime" : "monthly",
        source: "ai-file-recovery-app"
      },
      ...(isLifetime && {
        payment_intent_data: {
          metadata: {
            userId: userId,
            planType: "lifetime"
          }
        }
      }),
      ...(!isLifetime && {
        subscription_data: {
          metadata: {
            userId: userId,
            planType: "monthly"
          }
        }
      })
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);
    logStep("Stripe checkout session created", { sessionId: session.id, url: session.url });

    // Track checkout initiation in Supabase
    try {
      await supabaseClient.from("checkout_sessions").upsert({
        session_id: session.id,
        user_id: userId,
        customer_email: customerEmail,
        stripe_customer_id: customerId,
        plan_type: isLifetime ? "lifetime" : "monthly",
        amount: isLifetime ? 3999 : 1999,
        status: "pending",
        created_at: new Date().toISOString()
      });
      logStep("Checkout session tracked in database");
    } catch (dbError) {
      console.error("Database tracking error (non-critical):", dbError);
    }

    return new Response(JSON.stringify({ 
      checkoutUrl: session.url,
      sessionId: session.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: "Checkout creation failed",
      details: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
