// Builds dist/ for Netlify (see netlify.toml).
// Maintenance mode: the "under rework" page is the root; the current site is served under /old/.
// Only the files below are published — backoffice/, Cull/, docs and repo files never reach the web.
import { cpSync, rmSync } from 'node:fs';

const OUT = 'dist';
const SITE = ['index.html', 'mystory.html', 'other-projects.html', 'projects', 'assets', 'firebase-portfolio-analytics.js'];
// Referenced nowhere; too heavy to deploy.
const EXCLUDE = [/OPENER\.mov$/, /PF_02_MakingOf/, /FULL-LIVRO\.pdf$/];

rmSync(OUT, { recursive: true, force: true });
cpSync('maintenance', OUT, { recursive: true });
for (const path of SITE) {
  cpSync(path, `${OUT}/old/${path}`, {
    recursive: true,
    filter: (src) => !EXCLUDE.some((re) => re.test(src.replaceAll('\\', '/'))),
  });
}
console.log(`Built ${OUT}/: maintenance page at /, site at /old/`);
