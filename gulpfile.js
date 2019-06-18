const fs = require('fs');
const captureWebsite = require('capture-website');


const themesDir = __dirname + '/themes';
const screenshotDir = __dirname + '/screenshots';

async function screenshotAllThemes() {
	const themes = fs.readdirSync(themesDir).map(f => (/^.+(?=\.css$)/.exec(f) || [''])[0]).filter(f => f);

	for (const theme of themes) {
		await screenshotTheme(theme);
	}
}

async function screenshotTheme(theme) {
	const file = `${screenshotDir}/${theme}.png`;
	if (fs.existsSync(file)) {
		fs.unlinkSync(file);
	}

	await captureWebsite.file(screenshotDir + '/code.html', file, {
		defaultBackground: false,
		styles: [
			fs.readFileSync(`${themesDir}/${theme}.css`, 'utf-8')
		],

		beforeScreenshot: async (page, browser) => {
			const box = await page.$('pre').then(e => e.boxModel());

			await page.setViewport({ width: box.width, height: box.height, deviceScaleFactor: 1 });
		}
	});
}

exports.screenshot = screenshotAllThemes;
