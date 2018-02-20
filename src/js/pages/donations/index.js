import {
  live as CONFIG,
  // testnet as CONFIG,
} from '../../config';
import {
  Server,
} from 'stellar-sdk';
import PaymentsManager from '../../stellar-payments';
import DonationBoards from './boards';

const {
  bind,
} = window.hyperHTML;

const SERVER = new Server(CONFIG.serverUrl);
const STREAM_MANAGER = new PaymentsManager(SERVER);

/**
 * Display amount of Lumens allocated
 */
const amount = document.querySelector('[data-id="contribution"]');

const BOARD_MANAGER = new DonationBoards();

const accountIdInput = document.querySelector('input[data-account-id]');

export default class DonationPage {
  constructor() {
    // Use `CONFIG` by as the default state but be aware that the state can change
    this.state = CONFIG;

    this.updatePayments();
    this.updateInput();
    this.updateSummary();
  }

  /**
   * Handle each incoming transaction individually
   */
  handleIncomingTransaction(response) {
    response.transaction().then((responseData) => {
      const amount = parseFloat(response.amount).toFixed(2);
      const isEnough = amount >= this.state.minimumAmount;

      if (!isEnough || isNaN(amount)) {
        return;
      }

      const date = new Date(response.created_at);

      BOARD_MANAGER.addEntry({
        amount,
        date: `${date.toLocaleString()}`,
        id: responseData.id,
        memo: responseData.memo_type === 'text' ? responseData.memo : '🎉 Thank you!',
      });
      BOARD_MANAGER.updateBoards();
      this.updateSummary();
    });
  }

  updatePayments() {
    BOARD_MANAGER.resetBoards();
    STREAM_MANAGER.updateStream(this.state.accountId, this.handleIncomingTransaction.bind(this));
  }

  /**
   * Input field where user can insert any account ID
   */
  updateInput(accountId = this.state.accountId) {
    accountIdInput.setAttribute('placeholder', accountId);
    accountIdInput.addEventListener('input', () => {
      this.state.accountId = accountIdInput.value;
      this.updatePayments(accountIdInput.value);
    });
  }

  /**
   * This represents the text displayed at the very top of the page.
   */
  updateSummary(accountId = this.state.accountId) {
    SERVER.loadAccount(accountId)
      .then((response) => {
        const balance = parseFloat(response.balances[0].balance).toFixed(2);
        bind(amount)`
        ${balance} lumens (XLM) contributed so far. You rock :-)`;
      });
  }
}
