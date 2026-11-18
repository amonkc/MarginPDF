// Interface fonts for the self-hosted build (npm run build:web): served from this site instead of Google Fonts,
// so no visitor data goes to a third party. Each file covers one script (unicode-range), so a browser only
// downloads the subsets a page actually shows. The artifact build links Google Fonts instead (see vite.config.ts).
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource/instrument-sans/400.css';
import '@fontsource/instrument-sans/500.css';
import '@fontsource/instrument-sans/600.css';
import '@fontsource/ibm-plex-sans-thai/thai-400.css';
import '@fontsource/ibm-plex-sans-thai/thai-500.css';
import '@fontsource/spline-sans-mono/400.css';
import '@fontsource/spline-sans-mono/500.css';
