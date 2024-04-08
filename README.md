<span style="text-align:center;display:block;width:100%;"><img src="http://i.imgur.com/UtbIc4S.png" style="width:75%" title="Example of FlipDown" style="width: 500px;text-align:center"></span>

# FlipDown

⏰ A lightweight and performant flip styled countdown clock.

Forked by Destination for use as an ES module

## Features

-   💡 Lightweight - No jQuery! <11KB minified bundle
-   ⚡ Performant - Animations powered by CSS transitions
-   📱 Responsive - Works great on screens of all sizes
-   🎨 Themeable - Choose from built-in themes, or add your own
-   🌍 i18n - Customisable headings for your language

## Basic Usage

To get started, install with `npm install @destination/flipdown` or `yarn add @destination/flipdown`.

For basic usage, FlipDown takes a unix timestamp (in seconds) as an argument.

```js
import { FlipDown } from "@destination/flipdown";
import "@destination/flipdown/dist/dark.css";
import "@destination/flipdown/dist/flipdown.css";

new FlipDown(1538137672, '#flipdown').start();
```

```html
<div id="flipdown" class="flipdown"></div>
```

### Custom Themes

Custom themes can be added by adding a new stylesheet using the FlipDown [theme template](https://github.com/PButcher/flipdown/blob/master/src/flipdown.css#L3-L34).

FlipDown themes must have the class name prefix of: `.flipdown__theme-` followed by the name of your theme. For example, the standard theme class names are:

-   `.flipdown__theme-dark`
-   `.flipdown__theme-light`

You can then load your theme by specifying the `theme` property in the `opt` object of the constructor (see [Themes](#Themes)).

## Headings

You can add your own rotor group headings by passing an array as part of the `opt` object. Bear in mind this won't change the functionality of the rotors (eg: the 'days' rotor won't magically start counting months because you passed it 'Months' as a heading).

Suggested use is for i18n. Usage as follows:

```javascript
new FlipDown(1538137672, '#flipdown', {
    headings: ["Nap", "Óra", "Perc", "Másodperc"]
}).start();
```

Note that headings will default to English if not provided: `["Days", "Hours", "Minutes", "Seconds"]`

## API

### `FlipDown.prototype.constructor(uts, [el], [opts])`

Create a new FlipDown instance.

#### Parameters

##### `uts`

Type: _number_

The unix timestamp to count down to (in seconds).

##### `[el]`

**Optional**
Type: _string_ (default: `flipdown`)

The DOM element ID to attach this FlipDown instance to. Defaults to `flipdown`.

##### `[opts]`

**Optional**
Type: _object_ (default: `{}`)

Optionally specify additional configuration settings. Currently supported settings include:

-   [`theme`](#Themes)
-   [`headings`](#Headings)

### `FlipDown.prototype.start()`

Start the countdown.

### `FlipDown.prototype.ifEnded(callback)`

Call a function once the countdown has ended.

#### Parameters

##### `callback`

Type: _function_

Function to execute once the countdown has ended.

#### Example

```javascript
var flipdown = new FlipDown(1538137672, '#flipdown')

    // Start the countdown
    .start()

    // Do something when the countdown ends
    .ifEnded(() => {
        console.log("The countdown has ended!");
    });
```

## Acknowledgements

Thanks to the following people for their suggestions/fixes:

-   [@chuckbergeron](https://github.com/chuckbergeron) for his help with making FlipDown responsive.
-   [@vasiliki-b](https://github.com/vasiliki-b) for spotting and fixing the Safari backface-visibility issue.
-   [@joeinnes](https://github.com/joeinnes) for adding i18n to rotor group headings.
