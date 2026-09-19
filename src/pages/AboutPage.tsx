import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Heart, Leaf } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div id="about-page" className="min-h-screen bg-[#F5E6D3] text-[#4A382D] py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#77553b] font-semibold block">
            The OWNonce Philosophy
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#4A382D] font-normal leading-tight">
            Crafting the Absolute Quintessential Top
          </h1>
          <p className="text-xs sm:text-sm text-[#82756c] leading-relaxed">
            Born from the desire to create the perfect basic top—uncompromised in fabric quality, flattering in proportion, and crafted to outlast every fleeting micro-trend.
          </p>
        </div>

        {/* Hero Visual */}
        <div className="rounded-xl overflow-hidden border border-[#d4c3b9] aspect-[16/9] shadow-xs">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80"
            alt="OWNonce Atelier Collection"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Narrative Sections */}
        <div className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] p-8 sm:p-12 shadow-xs space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs uppercase font-sans tracking-widest text-[#77553b] font-semibold block">
                01 • The Origin
              </span>
              <h2 className="text-2xl font-serif text-[#4A382D]">
                Why "OWNonce"?
              </h2>
              <p className="text-xs sm:text-sm text-[#82756c] leading-relaxed">
                The name reflects our foundational belief: when a garment is tailored with perfection from a refined 94% cotton and 6% Lycra blend, you only need to <em>own it once</em>. It retains its hand-feel, rich pigment, and sculpted shape wash after wash.
              </p>
            </div>
            <div className="bg-[#F5E6D3]/40 p-6 rounded-lg border border-[#d4c3b9] space-y-2">
              <h3 className="font-serif text-base text-[#4A382D]">The Four Core Styles:</h3>
              <ul className="text-xs text-[#82756c] space-y-1.5 list-disc list-inside">
                <li>Basic Round Neck – Short Sleeve</li>
                <li>Basic Round Neck – Sleeveless</li>
                <li>Basic V-Neck – Short Sleeve</li>
                <li>Basic V-Neck – Sleeveless</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#d4c3b9]/50 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#F5E6D3] text-[#77553b] flex items-center justify-center mb-3">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#4A382D]">94% Cotton / 6% Lycra</h3>
              <p className="text-xs text-[#82756c] leading-relaxed">
                We strictly source extra-long staple Egyptian fibers that are gently combed to eliminate impurities, providing an ultra-soft second-skin touch.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#F5E6D3] text-[#77553b] flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#4A382D]">Calibrated Necklines</h3>
              <p className="text-xs text-[#82756c] leading-relaxed">
                Every collar ribbing is reinforced with micro-elasticity to prevent stretching or sagging, maintaining a crisp, polished neckline.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#F5E6D3] text-[#77553b] flex items-center justify-center mb-3">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#4A382D]">Ethical Cairo Atelier</h3>
              <p className="text-xs text-[#82756c] leading-relaxed">
                Crafted locally in Egypt under fair, ethical workplace standards by seasoned garment artisans who take immense pride in every stitch.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-6 border-t border-[#d4c3b9]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-serif text-[#4A382D]">Ready to build your essential wardrobe?</h4>
              <p className="text-xs text-[#82756c]">Experience the difference of masterfully spun everyday tops.</p>
            </div>
            <Link
              to="/products"
              className="px-6 py-3.5 bg-[#B89578] hover:bg-[#96745A] text-[#FFFDF9] text-xs font-sans uppercase tracking-wider font-semibold rounded transition-colors flex items-center gap-2"
            >
              <span>Explore Tops</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
