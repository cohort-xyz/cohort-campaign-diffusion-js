# Cohort Campaign Diffusion JS SDK

[![npm](https://img.shields.io/npm/v/@cohort-xyz/cohort-campaign-diffusion-js)](https://www.npmjs.com/package/@cohort-xyz/cohort-campaign-diffusion-js)
![npm bundle size](https://img.shields.io/bundlephobia/min/@cohort-xyz/cohort-campaign-diffusion-js)

---

[Cohort](https://getcohort.com/) is the Plug and Play marketing solution that turns the customer account into a powerful engagement channel for brands.

---

Cohort Campaign Diffusion JS SDK is a JavaScript SDK to enable broadcasting Cohort Challenges in your website.

Find all the Cohort's documentation at [docs.getcohort.com](https://docs.getcohort.com/).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Development](#development)
- [License](#license)

## Installation

Via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@cohort-xyz/cohort-campaign-diffusion-js/dist/cohort-campaign-diffusion-sdk.umd.js"></script>
<script>
  const cohort = new CohortCampaignDiffusionSDK('YOUR_API_KEY');
  // or
  // const cohort = new CohortCampaignDiffusionSDK('YOUR_API_KEY', true); // verbose mode
</script>
```

## Usage

You will need to create an API key in your back-office in order to use the SDK.

Refer to [this page](https://docs.getcohort.com/developers/merchants-api#authentication) in the documentation for more information on how to create an API key.

**_Since the SDK is a client-side library, please make sure to create an API key with the minimum permissions required (only the default ones are required)_**

Once you API key is created, you can configure the SDK behaviour in the dedicated page of your back-office.

## Examples

- [React Example](examples/react/README.md)

## Development

```sh
pnpm install
pnpm dev
```

## License

This project is licensed under the MIT license.

See [LICENSE](LICENSE) for more information.
