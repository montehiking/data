# MonteHiking/Data

Datasets for the [MonteHiking](https://montehiking.com/) app.

## Changing datasets

To make changes to any dataset, simply edit it and submit a [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) to the [develop](https://github.com/montehiking/data/tree/develop) branch. Changes will be added after moderation.

We use the [json](https://en.wikipedia.org/wiki/JSON) format to store [points](/docs/points/) and [trails](/docs/trails/) data.

You can use [json schemas](/schemas/) to check that all required fields are filled in correctly.

**Note!** The coordinates are in reverse order, similar to how it is [applied in GeoJson](https://datatracker.ietf.org/doc/html/rfc7946#section-4): longitude, latitude, altitude.

## Compiling datasets for production (developers only)

### Pre requirements

- `node.js`: `16.*`
- `yarn`: `1.22.*`

### Installation

1. install `node` and `yarn`
2. run `yarn install` on repository root
3. run `yarn run build` to compile datasets
