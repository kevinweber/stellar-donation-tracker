import React from 'react';
import PropTypes from 'prop-types';

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

function selectInputText(inputElement) {
  inputElement.setSelectionRange(0, inputElement.value.length);
}

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

Teaser.propTypes = {
  balance: PropTypes.string,
};

export default class DonationPage extends React.Component {
  constructor() {
    super();

    this.state = {
      accountSummary: {
        balance: '',
      },
      config: Object.assign({}, CONFIG),
      payments: [],
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  componentDidMount() {
    this.updateStream();
  }

  updateStream() {
    const newState = this.state;
    newState.payments = [];
    this.setState(newState, () => {
      STREAM_MANAGER.updateStream(this.state.config.accountId, this.handleIncomingTransaction.bind(this));
      this.updateSummary();
    });
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

  handleInput(event) {
    const newState = this.state;

    if (event.target.value.length === 0) {
      newState.config.accountId = CONFIG.accountId;
    } else {
      newState.config.accountId = event.target.value;
    }

    this.setState(newState, () => {
      this.updateStream();
      this.updateSummary();
    });
  }

  handleFocus(event) {
    const valueLength = event.target.value.length;

    if (valueLength === 0) {
      event.target.value = CONFIG.accountId;
    }

    selectInputText(event.target);
  }

  render() {
    return [
      <header key="1">
        <Teaser balance={this.state.accountSummary.balance} />
        <h1>lumens <img src="assets/img/not-for-profit.svg" style={{
          height: '2.5em',
          marginBottom: '-0.9em',
        }} alt="" /> space</h1>
        <div className="info">
          <p>Stellar Donation Tracker</p>
          <p>This page demonstrates the tool available <a href="https://github.com/kevinweber/stellar-donation-tracker">on Github</a> <img className="icon-github" src="assets/img/github.svg" />.</p>
          <p>It lists the highest and most recent payments sent to a Stellar account in real-time, including the <code>Memo text</code> of a transaction, if provided.</p>
          <input type="text" placeholder={this.state.config.accountId} onChange={this.handleInput} onFocus={this.handleFocus} />
        </div>
      </header>,
      <DonationBoards key="2" topListLength={this.state.config.topListLength} payments={this.state.payments} />
    ];
  }
}
