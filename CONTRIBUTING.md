# Contributing to Prism Themes

Thank you for coming on board!

There are a few ways you can contribute to Prism Themes, such as:

-   [Filing bug reports](#filing-bug-reports)
-   [Discussing the project](#discussing-the-project)
-   [Submitting Pull Requests](#submitting-pull-requests), whether it's for documentation or code
-   [Creating new themes](#creating-new-themes)

## Filing bug reports

If you run into an error or a bug while using a theme from this repository:

1.  Confirm that the bug lies with the theme and not Prism or one of its plugins. You can check by swapping the theme out for another theme. If the issue lies with Prism or one of its plugins, please head over to the [main repository](https://github.com/PrismJS/prism) instead.
    -   In addition, please be sure that you only have one theme loaded! Having multiple themes loaded may result in conflicting or unexpected styles.

2.  Check [existing issues (both open and closed)](https://github.com/PrismJS/prism-themes/issues?q=is%3Aissue) to see if it had previously been reported and/or resolved. If an existing issue exists, please leave a comment on it instead of creating a new issue.

3.  [Open a new issue](https://github.com/PrismJS/prism-themes/issues/new/choose) with a clear and concise title, and include any relevant information such as:
    -   The name of the theme you're having an issue with
    -   Any plugins that you're using, if applicable
    -   Screenshots and/or a reproducible example
    -   Browser information

### Security issues

In the case of security issues, please check our [Security Policy](https://github.com/PrismJS/prism-themes/security/policy) for details instead.

## Discussing the project

Perhaps you have some thoughts on Prism Themes, whether it's the state of the code, documentation, features you think might be useful, or simply want to know when the next release will be because you really like the latest theme and want to use it! Please [open a new issue](https://github.com/PrismJS/prism-themes/issues/new/choose) and let us know!

## Submitting Pull Requests

Whether it's documentation or code, Prism Themes welcomes Pull Requests! (If you're specifically looking to contribute a brand new theme, the next section on [Creating new themes](#creating-new-themes) would be more relevant.)

1.  Fork this repository and create a new branch. It is possible that you do not have to clone it to your machine if you do not have to regenerate theme screenshots. If you need help at any point, please reach out by [opening a new issue](https://github.com/PrismJS/prism-themes/issues/new/choose)!

2.  Make the changes.

3.  Commit the changes, and include clear and concise commit messages when doing so.

4.  Once you're done making the changes, [submit a Pull Request](https://github.com/PrismJS/prism-themes/compare)!
    -   If your Pull Request resolves an open issue (or more), please include [`closes #issuenumber`](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword) (for each issue) in the description.

5.  A maintainer will look through your changes and review them accordingly, providing further instructions where necessary.

Thank you for submitting a Pull Request! We really appreciate the time and effort you've put into it :)

## Creating new themes

Prism themes are CSS files that set rules for inline code, code blocks, and the tokens within them. We have a [theme template](template/prism-theme-template.css) you may want to use as a starting point, as it provides additional tips and details beyond what is stated here. Additionally, when designing your theme, please make sure that the [theme guidelines and requirements](#theme-guidelines-and-requirements) are adhered to.

### How to style...

#### Tokens

To style a token, you can use a selector like:

```css
.token.token-name {
	/* styles */
}
```

Here is a list of [Prism's standard tokens](https://prismjs.com/tokens.html), including the general concept behind them and some examples. All of these standard tokens are included in the [theme template](template/prism-theme-template.css).

##### Is there a comprehensive list of tokens to style?

We're glad you asked! While we have some [resources](#resources) for discovering tokens available in each language, we unfortunately do not currently have a list containing the name of every single token. However, covering the [standard tokens](https://prismjs.com/tokens.html) should be enough for most cases.

If you'd like to help document more tokens, we would really appreciate your assistance [over at the main repository](https://github.com/PrismJS/prism/issues?q=is%3Aopen+is%3Aissue+label%3Adocs)!

#### Tokens for a specific language

Perhaps you want a particular token to be styled differently in a certain language. For example, CSS uses `.important` to style `!important`, while Markdown uses the same token in its headings, and you want them to have different styles. You can achieve it with the following selectors:

```css
/* Tokens with the `.important` class */
.token.important {
	/* styles */
}

/* Tokens in a CSS block with the `.important` class */
.language-css .token.important {
	/* styles */
}

/* Tokens in a Markdown block with the `.important` class */
.language-markdown .token.important {
	/* styles */
}
```

### Code style guidelines

We use [stylelint](https://stylelint.io/) to automatically check code style. Just run `npm run lint` to check (and `npm run lint-fix` to fix)!

### Theme guidelines and requirements

Your theme will be used by Prism and its plugins, which have default CSS rules of their own. To ensure that your theme is compatible with Prism and its plugins, please follow these guidelines!

#### Do not use CSS variables, at least not yet

This may be a little strange, but it's because Prism supports IE11, which does not support CSS variables. However, we will be [dropping support for IE11 in Prism V2](https://github.com/PrismJS/prism/issues/1578), so you are encouraged to leave commented-out CSS variables (or at least a list of the colours you used) in your CSS files for an easier transition later on!

#### Ensure that your token selectors include the `.token` class

Prism adds the class `.token` to the, well, tokens, that it highlights with its wizardry magic. As such, all tokens that are highlighted by Prism will include the `.token` class. When you declare a style for a specific token, please make sure to include the `.token` class in your selector!

```css
/* Do this */
.token.token-name {
	/* styles */
}

/* Do not do this */
.token-name {
	/* styles */
}
```

#### Maintain a font size of `1em` for code blocks

Some of Prism's plugins assume that the `pre` and `code` elements have the same font size, else there will be bugs pertaining to misaligned and so forth. As such, please set the `font-size` of `code[class*="language-"], pre[class*="language-"]` to `1em`, i.e.:

```css
code[class*="language-"],
pre[class*="language-"] {
	font-size: 1em;
	/* more styles */
}
```

#### Increase selector specificity if/when overriding the default CSS rules of plugins

If you want to take things a step further, you can also style the additional elements that [Prism's plugins](https://prismjs.com/index.html#plugins) create in the DOM!

Since it is not possible for Prism to enforce the ordering of stylesheets in all cases, it is necessary to increase the [specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) of your selectors for your theme's plugin overrides to ensure your overrides, well, override! Here's an example with the [Show Invisibles plugin](https://prismjs.com/plugins/show-invisibles):

```css
/* Default Show Invisibles plugin styles */
.token.tab:not(:empty):before,
.token.cr:before,
.token.lf:before,
.token.space:before {
	color: #808080;
	opacity: 0.6;
}

/* Your Show Invisibles plugin overrides */
.token.token.tab:not(:empty):before,
.token.token.cr:before,
.token.token.lf:before,
.token.token.space:before {
	/* your styles */
}
```

Our [plugin templates](template) covers most, if not all, of the plugins and overrides of interest, so you can just grab the selectors from there!

If you'd like to prioritise plugins to style, these are the top three most popular plugins:

1.  [Line Highlight](https://prismjs.com/plugins/line-highlight)
2.  [Line Numbers](https://prismjs.com/plugins/line-numbers)
3.  [Toolbar](https://prismjs.com/plugins/toolbar)

#### Avoid re-declaring existing declarations if/when styling plugins

To ensure forward compatibility, do not re-declare existing declaration if/when styling plugins. For example, the [Line Highlight plugin](https://prismjs.com/plugins/line-highlight) begins with the following CSS:

```css
/* Default Line Highlight plugin styles */
pre[data-line] {
	position: relative;
	padding: 1em 0 1em 3em;
}

.line-highlight {
	position: absolute;
	left: 0;
	right: 0;
	padding: inherit 0;
	margin-top: 1em; /* Same as .prism’s padding-top */

	background: hsla(24, 20%, 50%,.08);
	background: linear-gradient(to right, hsla(24, 20%, 50%,.1) 70%, hsla(24, 20%, 50%,0));

	pointer-events: none;

	line-height: inherit;
	white-space: pre;
}
```

While you might want to change the background colour of highlighted lines to fit your theme better, there is no need to redeclare other properties such as `position`, `left`, `right`, and so on, since those values should not change. Plus, we may fix bugs in those plugins in the future that involve changing these default properties; re-declaring the existing defaults will bring those fixed bugs right back.

### Resources

Here are some resources that you may find helpful when designing and developing a new theme:

-   [Themes in the main repository](https://github.com/PrismJS/prism/tree/master/themes) and [themes in this repository](https://github.com/PrismJS/prism-themes/tree/master/themes) — examples you can refer to
-   [prismjs.com: Examples](https://prismjs.com/examples.html) — use together with your browser's DevTools to see a sample of tokens in each language in action
-   [prismjs.com: Test drive](https://prismjs.com/test.html) — enter your own code samples and see how they get grouped and highlighted (as well as what tokens they map to, with the help of your browser's DevTools)
-   [prismjs.com: FAQ: How do I know which tokens I can style for every language?](https://prismjs.com/faq.html#how-do-i-know-which-tokens-i-can-style-for) — a reference of the tokens available per language
-   [prismjs.com: Prism tokens](https://prismjs.com/tokens.html) — a list of the standard tokens and the general concept behind each of them, including examples
-   [prismjs.com: Plugins](https://prismjs.com/index.html#plugins) — Prism's plugins, in the event you'd like to override their default styles!
-   [css-tricks.com: Specifics on CSS Specificity](https://css-tricks.com/specifics-on-css-specificity/) — a great guide to CSS specificity

### Submitting your themes

This section assumes some familiarity with git and npm (and of course, that you have git and a recent-ish version of [Node.js](https://nodejs.org/) installed). If you have any questions or need more guidance beyond Google, please reach out by [opening a new issue](https://github.com/PrismJS/prism-themes/issues/new/choose), we'll be happy to help!

1.  If you haven't already done so, please fork prism-themes and clone it to your machine. It would also be wise to create a new branch to work on.

2.  Copy your CSS file into the `themes` directory. Your theme's filename must be of the format `prism-<theme-name>.css`.

3.  Take a screenshot of your theme by running the following command in your project's directory:
    ```bash
    npm install --dev && npx gulp screenshot
    ```

4.  Add your theme and its screenshot to the README.

5.  Verify that all checks pass by running:
    ```bash
    npm test
    ```

6.  [Submit a Pull Request](https://github.com/PrismJS/prism-themes/compare), and we'll get back to you within a week! (Else, give us a ping!)

We look forward to your new theme :)
