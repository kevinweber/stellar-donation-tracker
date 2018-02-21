import React from 'react';
import {
  render,
} from 'react-dom';

import {
  live as CONFIG,
  // testnet as CONFIG,
} from '../../config';

import {
  Server,
} from 'stellar-sdk';
import PaymentsManager from '../../stellar-payments';

import DonationBoards from './boards';

const SERVER = new Server(CONFIG.serverUrl);
const STREAM_MANAGER = new PaymentsManager(SERVER);

class Teaser extends React.Component {
  render() {
    if (!this.props.balance) {
      return null;
    }

    return (
      <p className="teaser">{
        `${this.props.balance} lumens (XLM) contributed so far. You rock :-)`
      }</p>
    );
  }
}

export default class DonationPage extends React.Component {
  constructor() {
    super();

    this.state = {
      accountSummary: {
        balance: '',
      },
      config: CONFIG,
      payments: [],
    };
  }

  componentDidMount() {
    this.updateStream();
    this.updateSummary();
  }

  updateStream() {
    STREAM_MANAGER.updateStream(this.state.config.accountId, this.handleIncomingTransaction.bind(this));
  }

  /**
   * This represents the text displayed at the very top of the page.
   */
  updateSummary() {
    SERVER.loadAccount(this.state.config.accountId)
      .then((response) => {
        const balance = parseFloat(response.balances[0].balance).toFixed(2);
        const newState = this.state;

        newState.accountSummary.balance = balance;
        this.setState(newState);
      });
  }

  /**
   * Handle each incoming transaction individually
   */
  handleIncomingTransaction(response) {
    response.transaction().then((responseData) => {
      const amount = parseFloat(response.amount).toFixed(2);
      const isEnough = amount >= this.state.config.minimumAmount;

      if (!isEnough || isNaN(amount)) {
        return;
      }

      const date = new Date(response.created_at);

      this.state.payments.push({
        amount,
        date: `${date.toLocaleString()}`,
        id: responseData.id,
        memo: responseData.memo_type === 'text' ? responseData.memo : '🎉 Thank you!',
      });

      this.setState(this.state);
    });
  }

  render() {
    return [
      <header>
        <Teaser balance={this.state.accountSummary.balance} />
        <h1>lumens <img src="assets/img/not-for-profit.svg" style={{
          height: '2.5em',
          marginBottom: '-0.9em',
        }} alt="" /> space</h1>
        <div className="info">
          <p>Stellar Donation Tracker</p>
          <p>This page demonstrates the tool available <a href="https://github.com/kevinweber/stellar-donation-tracker">on Github</a> <img className="icon-github" src="assets/img/github.svg" />.</p>
          <p>The current version 1 lists the highest and most recent payments sent to a Stellar account in real-time, including the <code>Memo text</code> of a transaction, if provided.</p>
          <input data-account-id="" type="text" />
        </div>
        <span data-id="contribution"></span>
      </header>,
      <DonationBoards payments={this.state.payments} />
    ];
  }
}

// /**
//  * Display amount of Lumens allocated
//  */
// const amount = document.querySelector('[data-id="contribution"]');
//
// const BOARD_MANAGER = new DonationBoards();
//
// const accountIdInput = document.querySelector('input[data-account-id]');
//
// export default class DonationPage {
//   constructor() {
//     // Use `CONFIG` by as the default state but be aware that the state can change
//     this.state = Object.assign({}, CONFIG);
//
//     this.updatePayments();
//     this.updateInput();
//     this.updateSummary();
//   }
//
//
//   updatePayments() {
//     BOARD_MANAGER.resetBoards();
//     STREAM_MANAGER.updateStream(this.state.accountId, this.handleIncomingTransaction.bind(this));
//   }
//
//   /**
//    * Input field where user can insert any account ID
//    */
//   updateInput(accountId = this.state.accountId) {
//     accountIdInput.setAttribute('placeholder', accountId);
//     accountIdInput.addEventListener('input', () => {
//       // If no input is provided, fall back to default
//       if (accountIdInput.value.length === 0) {
//         this.state.accountId = CONFIG.accountId;
//       } else {
//         this.state.accountId = accountIdInput.value;
//       }
//
//       this.updatePayments(this.state.accountId);
//     });
//   }
//

// }
