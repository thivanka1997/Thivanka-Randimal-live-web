'use client';

import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="py-8 bg-[#08090d] border-t border-white/10 relative text-xs text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left Copyright */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8B9FFD]" />
            <span className="font-medium text-white">Made by Thivanka Randimal</span>
          </div>

          {/* Center Rights */}
          <div className="text-zinc-400 font-medium">
            © {new Date().getFullYear()} All rights reserved.
          </div>

          {/* Right Links */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setModalContent('privacy')}
              className="hover:text-[#8B9FFD] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>|</span>
            <button
              onClick={() => setModalContent('terms')}
              className="hover:text-[#8B9FFD] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
          </div>

        </div>
      </div>

      {/* Policy Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg card-dark-gradient border border-white/15 rounded-2xl p-6 text-left shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white capitalize">
                {modalContent === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h3>
              <button
                onClick={() => setModalContent(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-xs text-zinc-300 leading-relaxed space-y-3 max-h-60 overflow-y-auto pr-2">
              {modalContent === 'privacy' ? (
                <>
                  <p>
                    This portfolio website respects visitor privacy. No personal identifying information or telemetry tracking cookies are collected without express consent.
                  </p>
                  <p>
                    Any contact messages submitted via the contact form are stored securely and used solely for professional correspondence regarding project inquiries.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    All content, design assets, and case studies showcased on this website are the intellectual property of Thivanka Randimal Premarathna.
                  </p>
                  <p>
                    Demonstration software and UI concepts may contain simulated mock data created for portfolio representation purposes.
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setModalContent(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
