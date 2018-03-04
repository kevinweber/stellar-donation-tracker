# Stellar Donation Tracker

The Stellar Donation Tracker lists donations sent to a Stellar account in real-time. It provides a simple interface to list the highest and most recent payments including the `Memo text` of a transaction, if provided.

**Demo: [lumens.space](https://lumens.space/)**

In order to receive donations for your product or service, [create a Stellar account](https://www.stellar.org/developers/guides/get-started/create-account.html) and share its public key with potential contributors. Then they can donate [lumens](https://www.stellar.org/lumens/) to that address.

You can use this tool to publicly list all donations received. The Stellar Donation Tracker uses Stellar's [JavaScript API](https://www.stellar.org/developers/js-stellar-sdk/reference/).

More features are in development. Check out the "TODO" list below and see how you can contribute.

## Instructions for developers

Download this repository to your computer and navigate into the project folder:

```
git clone https://github.com/kevinweber/stellar-donation-tracker.git
cd stellar-donation-tracker/
```

Install all dependencies with NPM:

```
npm install
```

For development, run:

```
npm run watch
```

Open `/dist/index.html` in your browser to see the site.

--------------------------------------------------------------------------------

You can replace the default Stellar account ID with your own in `./src/js/config.js`.

To use Stellar's Testnet instead of the live network, go to `./src/js/pages/donations/index.js` and replace...

```
import {
  live as CONFIG,
  // testnet as CONFIG,
} from './config';
```

...with...

```
import {
  // live as CONFIG,
  testnet as CONFIG,
} from './config';
```

--------------------------------------------------------------------------------

To generate production-ready code, run:

```
npm run production
```

## TODO / Future Features

- [x] Replace hyperHTML with React
- [x] Provide input field to list donations for any account ID
- [ ] Support displaying donations based on GET parameter for account address
- [ ] Catch invalid account IDs
- [ ] Provide alternative view for addresses on Stellar's [Testnet](https://www.stellar.org/developers/guides/concepts/test-net.html)
- [ ] Update Webpack to latest version
- [ ] Create a widget that users can easily customize and drop into their website. The widget would display the amount of money which has been donated to an account (deposits are assumed to be donations) and the current balance of an account.
- [ ] Widget feature: Allow setting fundraising goals and display a graph that shows the fundraising progress accordingly. The progress can be displayed in a progress bar or using a [gauge](https://developers.google.com/chart/interactive/docs/gallery/gauge).
- [ ] Exclude or mark payments from inflation pool
- [ ] Add charts that visualize donation metrics, such as payments received per week, top donors and repeated payments from a single account
- [ ] Build an integration that allows users to easily donate in Lumens on the page where this tool is used
- [ ] Support for more currencies (e.g. BTC and ETH)
- [ ] Expand this tool into a platform where organizations can receive donations so they don't have to create and manage their own tool. Think of it as a Kickstarter platform on the Stellar network.

## How to contribute

Here are ideas how you can contribute to this project:

- Clone this repository and submit a pull request that fixes a bug or adds a new feature
- Create issue tickets for potential improvements
- Donate Lumens to `GDZVGNTOWHQ244N45SO4F5Y2YPBJF63ZD3T5GGHGDILENJGZIC5YZEWK` and see your donation listed on [lumens.space](https://lumens.space/)
