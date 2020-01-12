const fs = require('fs').promises;
const { parallel } = require('gulp');
const captureWebsite = require('capture-website');
const path = require('path');
const { JSDOM } = require('jsdom');


/**
 * @type {Object<string, ThemesEntry>}
 *
 * @typedef ThemesEntry
 * @property {string} title
 * @property {Entity} owner
 * @property {Entity} [originalOwner]
 * @property {Entity} [basedOn]
 *
 * @typedef {string | { name: string; link?: string }} Entity
 */
const themeCatalog = require('./themes.json').themes;


const themesDir = path.join(__dirname, 'themes');
const screenshotDir = path.join(__dirname, 'screenshots');
const getThemePath = theme => path.join(themesDir, `prism-${theme}.css`);
const getScreenshotPath = theme => path.join(screenshotDir, `prism-${theme}.png`);

/**
 * Returns the names of all themes. This includes the `prism-` prefix.
 */
async function getThemes() {
	return Object.keys(themeCatalog);
}

/**
 * Takes a screenshot of all themes overwriting the old ones.
 */
async function screenshotAllThemes() {
	for (const theme of await getThemes()) {
		await screenshotTheme(theme, true);
	}
}

/**
 * Takes a screenshot of themes which don't have one already.
 */
async function screenshotMissingThemes() {
	for (const theme of await getThemes()) {
		await screenshotTheme(theme, false);
	}
}

/**
 * Takes a screenshot of the given themes and saves the image file in the screenshot directory.
 *
 * __IMPORTANT:__ Screenshots have to be taken sequentially, one after an other, to prevent a memory leak.
 *
 * @param {string} theme
 * @param {boolean} overwrite
 */
async function screenshotTheme(theme, overwrite) {
	const file = getScreenshotPath(theme);

	if (await fs.stat(file).then(s => s.isFile()).catch(() => false)) {
		if (overwrite) {
			await fs.unlink(file);
		} else {
			return;
		}
	}

	await captureWebsite.file(screenshotDir + '/code.html', file, {
		defaultBackground: false,
		scaleFactor: 1,
		element: 'pre',
		styles: [
			await fs.readFile(getThemePath(theme), 'utf-8')
		]
	});
}

/**
 * Updates the "Available themes" section in `README.md`.
 */
async function updateReadme() {
	const themes = await getThemes();

	/**
	 * Returns the credit string of a theme.
	 *
	 * @param {ThemesEntry} entry
	 * @returns {string}
	 */
	function getCredit(entry) {
		if (entry.basedOn) {
			return `by ${printEntity(entry.owner)}, based on ${printEntity(entry.basedOn)}`;
		} else if (entry.originalOwner) {
			return `originally by ${printEntity(entry.originalOwner)}, adapted by ${printEntity(entry.owner)}`;
		} else {
			return `by ${printEntity(entry.owner)}`;
		}
	}
	/**
	 * @param {Entity} entity
	 */
	function printEntity(entity) {
		if (typeof entity === 'string') {
			return `[${entity}](https://github.com/${entity})`;
		} else if (entity.link) {
			return `[${entity.name}](${entity.link})`;
		} else {
			return entity.name;
		}
	}

	const md = themes.map(theme => {
		const css = `themes/prism-${theme}.css`;
		const screenshot = `screenshots/prism-${theme}.png`;

		const entry = themeCatalog[theme];
		const title = entry.title;
		const credit = getCredit(entry);

		return `* [__${title}__](${css}) (${credit})<br />\n[![${title}](${screenshot})](${css})`;
	}).join('\n\n');

	const readmePath = path.join(__dirname, 'README.md');
	let readme = await fs.readFile(readmePath, 'utf-8');
	readme = readme.replace(/(## Available themes)[\s\S]*/, (m, header) => {
		return `${header}\n\n${md}\n`;
	});

	await fs.writeFile(readmePath, readme, 'utf-8');
}

/**
 * Checks that all themes have a screenshot.
 */
async function checkScreenshots() {
	const themes = new Set(await getThemes());
	const screenshots = new Set(await fs.readdir(screenshotDir));
	screenshots.delete('code.html');

	for (const theme of themes) {
		if (!screenshots.delete(`prism-${theme}.png`)) {
			throw new Error(`The theme "${theme}" does not have a screenshot.`);
		}
	}

	if (screenshots.size > 0) {
		throw new Error(`There are screenshots without a theme: "${[...screenshots].join('", "')}"`);
	}
}

/**
 * Checks that all themes have a CSS file.
 */
async function checkCSS() {
	const themes = new Set(await getThemes());
	const cssFiles = new Set(await fs.readdir(themesDir));

	for (const theme of themes) {
		if (!cssFiles.delete(`prism-${theme}.css`)) {
			throw new Error(`The theme "${theme}" does not have a screenshot.`);
		}
	}

	if (cssFiles.size > 0) {
		throw new Error(`There are CSS files without a theme: "${[...cssFiles].join('", "')}"`);
	}
}

/**
 * @type {Object<string, Object<string, string | RegExp>>}
 */
const requirements = {
	'pre': {
		/* Code block: pre */

		'overflow': 'auto'
	},
	'pre > code': {
		/* Code block: code */

		'font-size': /^(?:1em|)$/
	},
	':not(pre) > code': {
		/* Inline: code */

		// none
	}
};

async function checkRequirements() {
	const getSource = css => {
		return `
			<!DOCTYPE html>
			<html>
			<head>
				<style>${css}</style>
			</head>
			<body>
				<!-- Code block -->
				<pre class="language-javascript"><code class="language-javascript">var a = 0;</code></pre>

				<!-- Inline code -->
				<code class="language-javascript">a++</code>
			</body>
			</html>
		`;
	};

	let pass = true;

	for (const theme of await getThemes()) {
		const dom = new JSDOM(getSource(await fs.readFile(getThemePath(theme), 'utf-8')));

		for (const selector in requirements) {
			const properties = requirements[selector];

			for (const element of dom.window.document.querySelectorAll(selector)) {
				const style = dom.window.getComputedStyle(element);

				for (const property in properties) {
					const expected = properties[property];
					const actual = style[property];

					let valid;
					if (typeof expected === 'string') {
						valid = expected === actual;
					} else {
						valid = expected.test(actual);
					}

					if (!valid) {
						pass = false;
						console.error(`${theme} does not meet the requirement for "${selector}":\n` +
							`  Expected the ${property} property to be ${expected} but found "${actual}"`);
					}
				}
			}
		}
	}

	if (!pass) {
		throw new Error('Some checks failed.');
	}
}


exports['update-readme'] = updateReadme;
exports.screenshot = screenshotMissingThemes;
exports['screenshot-all'] = screenshotAllThemes;
exports.build = parallel(screenshotMissingThemes, updateReadme);

exports.check = parallel(checkScreenshots, checkCSS, checkRequirements)
