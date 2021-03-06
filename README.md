# Homer Controller - Web User Manager

This is a web app that communicated with the [graphql-api](https://github.com/HomeIoTController/graphql-api) in order to create users, register and trigger commands.

## Getting Started

* To run this api just follow the steps on [compose](https://github.com/HomeIoTController/compose)

## List of available commands

The following Light state is available:

* `on` - true if the light is on, false if not, configurable
* `reachable` - true if the light can be communicated with, false if not
* `brightness` - Configurable brightness of the light (value from 0 to 254)
* `colorMode` - Color mode light is respecting (e.g. ct, xy, hs)
* `hue` - Configurable hue of the light (value from 0 to 65535)
* `saturation` - Configurable saturation of the light, compliments hue (value from 0 to 254)
* `xy` - Configurable CIE x and y coordinates (value is an array containing x and y values)
* `colorTemp` - Configurable Mired Color temperature of the light (value from 153 to 500)
* `transitionTime` - Configurable temporary value which eases transition of an effect (value in seconds, 0 for instant, 5 for five seconds)
* `alert` - Configurable alert effect (e.g. none, select, lselect)
* `effect` - Configurable effect (e.g. none, colorloop)
* `incrementBrightness` - Increment or decrement brightness value
* `incrementHue` - Increment or decrement hue value
* `incrementSaturation` - Increment or decrement saturation value
* `incrementXy` - Increment or decrement xy values
* `incrementColorTemp` - Increment or decrement color temperature value
