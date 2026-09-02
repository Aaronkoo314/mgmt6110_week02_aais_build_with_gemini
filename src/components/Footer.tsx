import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<string | null>(null);

  return (
    <>
      <footer className="bg-[#0f131e] border-t border-[#2A2E39] mt-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center py-8 px-4 md:px-8 max-w-[1200px] mx-auto text-xs md:text-sm text-[#B2B5BE] gap-4">
          <div className="font-semibold text-[#dfe2f2] font-display">
            © 2024 TradingView, Inc.
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setModalContent('Terms of Service: Market data is provided for informational and educational purposes. Always verify quotes with your broker.')}
              className="hover:text-[#dfe2f2] cursor-pointer transition-colors text-xs"
            >
              Terms
            </button>
            <button
              onClick={() => setModalContent('Privacy Policy: We protect your trading preferences, search history, and watchlist items locally.')}
              className="hover:text-[#dfe2f2] cursor-pointer transition-colors text-xs"
            >
              Privacy
            </button>
            <button
              onClick={() => setModalContent('Cookies Preferences: Strictly essential functional cookies and local state storage are utilized.')}
              className="hover:text-[#dfe2f2] cursor-pointer transition-colors text-xs"
            >
              Cookies
            </button>
          </div>
        </div>
      </footer>

      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1E222D] border border-[#2A2E39] rounded-xl max-w-sm w-full p-5 text-[#dfe2f2] shadow-2xl">
            <h4 className="text-base font-bold text-white font-display mb-2">Legal & Privacy</h4>
            <p className="text-xs text-[#c3c5d8] leading-relaxed mb-4">{modalContent}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setModalContent(null)}
                className="px-3.5 py-1.5 bg-[#2962ff] text-white text-xs font-semibold rounded hover:bg-[#1e4bd8]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
