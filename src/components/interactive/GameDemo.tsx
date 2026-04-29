import { useState, useRef } from 'preact/hooks';

interface Props {
  lang: string;
  loadingText: string;
  fullscreenText: string;
}

export default function GameDemo({ lang, loadingText, fullscreenText }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Map locale codes to Pragmatic Play supported lang codes
  const langMap: Record<string, string> = {
    en: 'en', ru: 'ru', de: 'de', fr: 'fr', es: 'es', pt: 'pt-br',
    it: 'it', nl: 'nl', pl: 'pl', cs: 'cs', sk: 'sk', hu: 'hu',
    ro: 'ro', bg: 'bg', hr: 'hr', sl: 'sl', sr: 'sr', uk: 'uk',
    tr: 'tr', el: 'el', ar: 'ar', he: 'he', hi: 'hi', bn: 'en',
    ja: 'ja', ko: 'ko', zh: 'zh', th: 'th', vi: 'vi', id: 'id',
    ms: 'ms', fil: 'en', sv: 'sv', no: 'no', da: 'da', fi: 'fi',
    et: 'et', lv: 'lv', lt: 'lt', ka: 'en',
  };

  const gameLang = langMap[lang] || 'en';
  const gameUrl = `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=${gameLang}&cur=USD&websiteUrl=demogamesfree.pragmaticplay.net%26&gameSymbol=vswaysbbhas&jurisdiction=99&lobbyUrl=https://clienthub.pragmaticplay.com/slots/game-library/`;

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  };

  return (
    <div class="relative" ref={containerRef}>
      {/* Game container */}
      <div class="relative w-full rounded-2xl overflow-hidden border border-ocean-600/30 bg-ocean-800" style={{ aspectRatio: '16/9' }}>
        {!showGame ? (
          /* Play overlay */
          <div class="absolute inset-0 flex flex-col items-center justify-center bg-ocean-800 z-10">
            <div class="text-center">
              {/* Game preview image */}
              <div class="w-32 h-32 mx-auto mb-6 rounded-2xl bg-ocean-700 flex items-center justify-center">
                <svg class="w-16 h-16 text-accent-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-white mb-2">Big Bass Crash</h3>
              <p class="text-sm text-gray-400 mb-6">Pragmatic Play</p>
              <button
                onClick={() => setShowGame(true)}
                class="inline-flex items-center gap-2 px-8 py-3 bg-gradient-cta text-white font-bold rounded-xl shadow-glow-green hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all hover:scale-105"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {loadingText.replace('...', '')} Demo
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Loading overlay */}
            {!loaded && (
              <div class="absolute inset-0 flex items-center justify-center bg-ocean-800 z-10">
                <div class="text-center">
                  <div class="w-12 h-12 border-4 border-accent-500/20 border-t-accent-500 rounded-full animate-spin mx-auto mb-4" />
                  <p class="text-sm text-gray-400">{loadingText}</p>
                </div>
              </div>
            )}

            {/* Game iframe */}
            <iframe
              src={gameUrl}
              class="w-full h-full border-0"
              allowFullScreen
              onLoad={() => setLoaded(true)}
              title="Big Bass Crash Game Demo"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </>
        )}
      </div>

      {/* Fullscreen button */}
      {showGame && loaded && (
        <button
          onClick={toggleFullscreen}
          class="absolute top-3 right-3 z-20 p-2 bg-ocean-900/80 backdrop-blur-sm rounded-lg text-gray-300 hover:text-white hover:bg-ocean-800 transition-colors border border-ocean-600/30"
          title={fullscreenText}
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
        </button>
      )}
    </div>
  );
}
