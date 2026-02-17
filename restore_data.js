
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://uykgpmgcayncaddtsspu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5a2dwbWdjYXluY2FkZHRzc3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MDQxNjksImV4cCI6MjA4NjI4MDE2OX0.ekzjGRRbUbQnkv5Dk3xqTc0odChxJLdlYt8dLyd6v2E';
const supabase = createClient(supabaseUrl, supabaseKey);

async function restoreData() {
  console.log('Initiating total data restoration protocol...');
  
  // 1. Fetch current (possibly partial) data to avoid overwriting recent changes
  const { data: current } = await supabase.from('site_settings').select('content').eq('id', 'homepage').maybeSingle();
  const existingContent = current?.content || {};

  const fullContent = {
    ...existingContent,
    // Ensure all modules exist
    profile: existingContent.profile || {
      name: "Ahmed Hameed Kapadia",
      title: "Premium Real Estate Investment Consultant",
      bio: "With over a decade of experience in the Dubai luxury market, I specialize in securing high-value assets for a global clientele.",
      image: "https://uykgpmgcayncaddtsspu.supabase.co/storage/v1/object/public/media/1770897883828-c9o4uj39666.webp",
      stats: [
        { label: "Market Dominance", value: "12+ Years" },
        { label: "Portfolio Value", value: "$1.2B+" },
        { label: "Client Satisfaction", value: "100%" }
      ],
      milestones: [
        { year: "2024", title: "Senior Investment Partner", company: "Exclusive Assets Group", description: "Spearheading luxury acquisitions." }
      ],
      skills: ["Strategic Negotiation", "Market Intelligence"],
      socials: { linkedin: "#", twitter: "#", instagram: "#" },
      cta: { primaryText: "Connect Now", primaryLink: "#contact", emailText: "Email Consultation", emailLink: "mailto:info@ahmedkapadia.com", callText: "Schedule Call", callLink: "/contact" }
    },
    about: existingContent.about || {
      title: "A LEGACY OF EXCELLENCE",
      subtitle: "Navigating the Dubai luxury real estate landscape with unparalleled expertise and a commitment to client success.",
      image: "https://uykgpmgcayncaddtsspu.supabase.co/storage/v1/object/public/media/1770830490214-ahmed-profile.jpg",
      stats: [
        { label: "Closed Volume", value: "$850M+" },
        { label: "VIP Clients", value: "200+" }
      ],
      points: ["Strategic Advisory", "Market Mastery", "Uncompromising Integrity"]
    },
    services: existingContent.services || {
      title: "BEYOND THE CONVENTIONAL",
      subtitle: "We define a new standard in real estate consulting, where every detail is managed with surgical precision.",
      service_items: [
        { title: 'Investment Advisory', description: 'Data-driven insights to maximize your portfolio growth in the UAE market.' },
        { title: 'Property Acquisition', description: 'Exclusive access to off-market properties and early developer releases.' },
        { title: 'Portfolio Management', description: 'End-to-end management services for domestic and international investors.' },
        { title: 'Corporate Services', description: 'Strategic real estate solutions for businesses and institutional entities.' }
      ],
      stats: [
        { label: "Market Access", value: "Unlimited", prefix: "", suffix: "" },
        { label: "Client Satisfaction", value: "100", prefix: "", suffix: "%" }
      ]
    },
    portfolio: existingContent.portfolio || {
      title: "A LEGACY IN BRICK & MORTAR",
      subtitle: "Selected for architectural brilliance and investment potential in Dubai's most coveted areas.",
      items: [
        { title: 'Palm Jumeirah Villa', location: 'The Palm, Dubai', price: '$12.5M', type: 'Exclusive Villa', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800' }
      ]
    },
    contact: existingContent.contact || {
      title: "INITIATE YOUR LEGACY",
      subtitle: "Available for private consultations and portfolio management strategies.",
      phone: "+971 00 000 0000",
      email: "info@ahmedkapadia.com",
      address: "Dubai, United Arab Emirates"
    }
  };

  const { error } = await supabase
    .from('site_settings')
    .upsert({ id: 'homepage', content: fullContent });

  if (error) {
    console.error('Restoration Failed:', error);
  } else {
    console.log('Restoration Successful. All modules synchronized.');
  }
}

restoreData();
