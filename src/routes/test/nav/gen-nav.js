import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routesDir = __dirname;
const outputFile = path.join(__dirname, 'test-nav.json');

/**
 * @typedef {Object} NavItem
 * @property {string} name
 * @property {string} path
 * @property {NavItem[]} [children]
 */

/**
 * @param {string} dir
 * @param {string} [basePath='']
 * @returns {Promise<NavItem[]>}
 */
async function scanDirectory(dir, basePath = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const result = [];

  for (const entry of entries) {
    const relativePath = path.join(basePath, entry.name);

    if (entry.isDirectory()) {
      // Skip directories that start with underscore or dot
      if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;

      // Recursively scan subdirectories
      const children = await scanDirectory(path.join(dir, entry.name), relativePath);

      // Check if directory has a +page.svelte directly inside it
      const hasPage = await fs
        .access(path.join(dir, entry.name, '+page.svelte'))
        .then(() => true)
        .catch(() => false);

      // Only add directory if it has children or contains a +page.svelte
      if (children.length > 0 || hasPage) {
        const navItem = {
          name: entry.name
        };

        // Only add path if directory has a +page.svelte
        if (hasPage) {
          navItem.path = `/test/range-slider/${relativePath}`;
        }

        // Add children if they exist
        if (children.length > 0) {
          navItem.children = children;
        }

        result.push(navItem);
      }
    }
  }

  return result;
}

async function generateNavigation() {
  try {
    const navigation = await scanDirectory(routesDir);

    // Sort by name
    navigation.sort((a, b) => a.name.localeCompare(b.name));

    // Write to JSON file with proper indentation
    await fs.writeFile(outputFile, JSON.stringify(navigation, null, 2));
    console.log(`Navigation data written to ${outputFile}`);
  } catch (error) {
    console.error('Error generating navigation:', error);
    process.exit(1);
  }
}

generateNavigation();
