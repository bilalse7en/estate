'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHero() {
      const { data } = await supabase.from('site_settings').select('content').eq('id', 'homepage').single();
      if (data?.content?.hero_slides) {
        setSlides(data.content.hero_slides);
      } else {
        setSlides([
          {
            title: "Elevating Your Dubai Lifestyle",
            subtitle: "Experience unparalleled service and exclusive access to the most prestigious properties in Dubai.",
            image: "https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&q=80&w=2000"
          },
          {
            title: "Uncompromising Integrity & Vision",
            subtitle: "Securing your legacy through expert market intelligence and bespoke acquisition strategies.",
            image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2000"
          }
        ]);
      }
      setLoading(false);
    }
    fetchHero();
  }, []);

  if (loading || slides.length === 0) {
    return (
      <div className="h-screen w-full bg-[var(--bg-main)] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        pagination={{ 
          clickable: true,
          dynamicBullets: true 
        }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={slides.length > 1}
        className="h-full w-full hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full flex items-center">
              {/* Background with Darkened Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url("${slide.image}")` }}
              >
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
              </div>

              <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full">
                <div className="max-w-4xl">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex items-center space-x-4 mb-8">
                      <span className="h-[2px] w-12 bg-primary-500 shadow-[0_0_15px_rgba(184,115,51,0.6)]" />
                      <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.5em] font-bold !text-primary-400">
                        Luxury Real Estate Advisor
                      </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold !text-white mb-8 tracking-tighter leading-[1.05] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                      {slide.title.includes(' ') ? (
                        <>
                          {slide.title.split(' ').slice(0, -2).join(' ')} <br className="hidden md:block" />
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 via-primary-500 to-primary-300 drop-shadow-none">
                            {slide.title.split(' ').slice(-2).join(' ')}
                          </span>
                        </>
                      ) : slide.title}
                    </h1>

                    <p className="text-base md:text-lg !text-white/95 max-w-2xl mb-12 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                      {slide.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <Link 
                        href="/#portfolio" 
                        className="btn-premium group w-full sm:w-auto min-w-[220px] !py-5 shadow-2xl border-2 border-primary-400/20 hover:border-primary-400/40"
                      >
                        <span className="mr-2 tracking-[0.2em] text-[10px] font-bold">EXPLORE PORTFOLIO</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link 
                        href="/submit-form" 
                        className="!py-5 btn-glass w-full sm:w-auto flex items-center justify-center space-x-3 font-bold tracking-[0.2em] text-[10px] px-10 py-5 border-2 hover:shadow-lg group/btn"
                      >
                        <span className="whitespace-nowrap uppercase group-hover/btn:text-primary-600 transition-colors">Private Inquiry</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Decorative gradient for bottom edge */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[var(--bg-main)] to-transparent z-10 pointer-events-none" />
    </section>
  );
}
