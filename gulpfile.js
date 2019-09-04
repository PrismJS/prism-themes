const fs = require('fs');
const captureWebsite = require('capture-website');


const themesDir = __dirname + '/themes';
const screenshotDir = __dirname + '/screenshots';

function getThemes() {
	return fs.readdirSync(themesDir).map(f => (/^.+(?=\.css$)/.exec(f) || [''])[0]).filter(f => f);
}

/**
 * Takes a screenshot of all themes overwriting the old ones.
 */
async function screenshotAllThemes() {
	for (const theme of getThemes()) {
		await screenshotTheme(theme, true);
	}
}

/**
 * Takes a screenshot of themes which don't have one already.
 */
async function screenshotMissingThemes() {
	for (const theme of getThemes()) {
		await screenshotTheme(theme, false);
	}
}

async function screenshotTheme(theme, overwrite) {
	const file = `${screenshotDir}/${theme}.png`;
	if (fs.existsSync(file)) {
		if (overwrite) {
			fs.unlinkSync(file);
		} else {
			return;
		}
	}

	await captureWebsite.file(screenshotDir + '/code.html', file, {
		defaultBackground: false,
		scaleFactor: 1,
		element: 'pre',
		styles: [
			fs.readFileSync(`${themesDir}/${theme}.css`, 'utf-8')
		]
	});
}

exports.screenshot = screenshotMissingThemes;
exports['screenshot-all'] = screenshotAllThemes;
