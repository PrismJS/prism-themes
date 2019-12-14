const fs = require('fs').promises;
const { parallel } = require('gulp');
const captureWebsite = require('capture-website');
const path = require('path');


const themesDir = path.join(__dirname, 'themes');
const screenshotDir = path.join(__dirname, 'screenshots');

/**
 * Returns the names of all themes. This includes the `prism-` prefix.
 */
async function getThemes() {
	return (await fs.readdir(themesDir)).map(f => (/^.+(?=\.css$)/.exec(f) || [''])[0]).filter(f => f);
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
	const file = `${screenshotDir}/${theme}.png`;

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
			await fs.readFile(`${themesDir}/${theme}.css`, 'utf-8')
		]
	});
}

/**
 * Checks that all themes have a screenshot.
 */
async function checkScreenshots() {
	for (const theme of await getThemes()) {
		const file = `${screenshotDir}/${theme}.png`;
		if (!await fs.stat(file).then(s => s.isFile()).catch(() => false)) {
			throw new Error(`The theme "${theme}" doesn't have a screenshot.`);
		}
	}
}

/**
 * Checks that all themes are in the list of available themes.
 */
async function checkAvailableThemes() {
	const readme = await fs.readFile(path.join(__dirname, 'README.md'), 'utf-8');

	for (const theme of await getThemes()) {
		if (!readme.includes(theme + ".css")) {
			throw new Error(`The theme "${theme}" is not included in the list of available themes.`);
		}
		if (!readme.includes(theme + ".png")) {
			throw new Error(`The screenshot of "${theme}" is not included in the list of available themes.`);
		}
	}
}

exports.screenshot = screenshotMissingThemes;
exports['screenshot-all'] = screenshotAllThemes;
exports.check = parallel(checkScreenshots, checkAvailableThemes)
