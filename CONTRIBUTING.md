# Contributing

## Adding a New Theme

To add your theme, copy your CSS file into the `themes` directory. The name of your file has to match the format `prism-{your-theme-id}.css`. Make sure your theme follows your guidelines.

Next, you have to register your theme in `themes.json`. Add a new entry like this:

```json
"{your-theme-id}": {
    "title": "Your title",
    "owner": "Your GitHub user name"
}
```

Additionally, you can also specify who the original owner is (`originalOwner`) or on what theme your theme is based (`basedOn`).
You aren't required to give a GitHub user name. You can also use a different name and link where the link is optional:

```json
"{your-theme-id}": {
    "title": "Your title",
    "owner": {
        "name": "My real name",
        "link": "https://github.com/someUserName"
    },
    "originalOwner": {
        "name": "Famous artist"
    }
}
```

At last, you have to rebuild the project by running:

```bash
npm i && npm run build
```

Before making a pull request, you can use the following command to verify that all our checks pass and that your theme follows all our guidelines:

```bash
npm test
```

Thank you so much for contributing!!


## Theme guidelines and requirements

Your theme will be used by Prism and its plugins which can also add CSS rules.
These guidelines will make sure that your theme is compatible with Prism and its plugins.

### Font size of code blocks

Some of Prism's plugins assume that the `pre` and `code` elements have the same font size.

To make sure that this is that case, all themes are __required__ to either include a rule which ensures that the property `font-size: 1em` is applied to all elements which match `pre > code[class*="language-"]` or to not change the font size of code blocks.

If you want to change the font size of code blocks, use the `font-size` property on the `pre` element. Example:

```css
pre[class*="language-"] {
    font-size: 90%;
}
```

### Overflow of `pre` elements

The `overflow` property of `pre` elements is __required__ to be left unset or set to `auto`.

This is required because other `overflow` values will cause problems with layouts based on `float` or flexboxes.

One notable exception is the original Coy theme because its shadows are impossible to implement otherwise.
