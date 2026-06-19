import { AxeBuilder } from '@axe-core/playwright';
import { chromium } from 'playwright-core';

const baseUrl = process.env.A11Y_BASE_URL || 'http://127.0.0.1:4173/UCSD-Skills-Library-Site/';
const chromePath = process.env.CHROME_PATH;
const chromeChannel = process.env.PLAYWRIGHT_CHROME_CHANNEL || 'chrome';

const routes = [
  '/',
  '/skills/',
  '/skills/tritonai-feedback/',
  '/skills/ucsd-branding/',
  '/skills/ucsd-data-classification/',
  '/skills/ucsd-memory/',
  '/skills/ucsd-memory-create/',
  '/skills/ucsd-msgraph-calendar/',
  '/404/',
];

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 1000 },
];

function absoluteUrl(route) {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedRoute = route.replace(/^\/+/, '');
  return new URL(normalizedRoute, normalizedBase).toString();
}

function formatViolation(pageResult, violation) {
  const nodes = violation.nodes
    .map((node) => `      - ${node.target.join(' ')}: ${node.failureSummary || node.html}`)
    .join('\n');
  return [
    `  [${violation.impact || 'unknown'}] ${pageResult.viewport} ${pageResult.route}: ${violation.id}`,
    `    ${violation.help}`,
    nodes,
  ].join('\n');
}

async function auditPage(page, route, viewportName) {
  const axe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
    .analyze();

  const domChecks = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].reduce((acc, element) => {
      acc[element.id] = (acc[element.id] || 0) + 1;
      return acc;
    }, {});

    return {
      duplicateIds: Object.entries(ids)
        .filter(([, count]) => count > 1)
        .map(([id, count]) => ({ id, count })),
      h1Count: document.querySelectorAll('h1').length,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      unlabeledButtons: [...document.querySelectorAll('button')]
        .filter((button) => {
          const hasText = button.textContent.trim().length > 0;
          const hasLabel = button.hasAttribute('aria-label') || button.hasAttribute('aria-labelledby');
          return !hasText && !hasLabel;
        })
        .length,
    };
  });

  const pageResult = {
    route,
    viewport: viewportName,
    violations: axe.violations.length,
    ...domChecks,
  };

  summary.push(pageResult);

  axe.violations.forEach((violation) => {
    failures.push(formatViolation(pageResult, violation));
  });

  if (domChecks.duplicateIds.length > 0) {
    failures.push(`  ${viewportName} ${route}: duplicate IDs ${JSON.stringify(domChecks.duplicateIds)}`);
  }

  if (domChecks.h1Count !== 1) {
    failures.push(`  ${viewportName} ${route}: expected one h1, found ${domChecks.h1Count}`);
  }

  if (domChecks.horizontalOverflow) {
    failures.push(`  ${viewportName} ${route}: document has horizontal overflow`);
  }

  if (domChecks.unlabeledButtons > 0) {
    failures.push(`  ${viewportName} ${route}: ${domChecks.unlabeledButtons} unlabeled button(s)`);
  }
}

const launchOptions = {
  headless: true,
  args: ['--no-sandbox'],
};

if (chromePath) {
  launchOptions.executablePath = chromePath;
} else {
  launchOptions.channel = chromeChannel;
}

const browser = await chromium.launch(launchOptions);

const failures = [];
const summary = [];

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();

    for (const route of routes) {
      const url = absoluteUrl(route);
      await page.goto(url, { waitUntil: 'load' });

      await auditPage(page, route, viewport.name);

      if (viewport.name === 'mobile') {
        await page.locator('.navbar-toggle').click();
        await auditPage(page, `${route}#mobile-menu-open`, viewport.name);
      }
    }

    await context.close();
  }
} finally {
  await browser.close();
}

console.table(summary);

if (failures.length > 0) {
  console.error('\nAccessibility audit failed:\n' + failures.join('\n'));
  process.exit(1);
}

console.log(`Accessibility audit passed for ${routes.length} routes across ${viewports.length} viewport sizes.`);
