import '../scss/index.scss';
import {
  live as CONFIG,
  // testnet as CONFIG,
} from './config';
import {
  Server,
} from 'stellar-sdk';
import PaymentsManager from './stellar-payments';

const {
  bind,
  wire,
} = window.hyperHTML;

const SERVER = new Server(CONFIG.serverUrl);
const STREAM_MANAGER = new PaymentsManager(SERVER);

/**
 * Display amount of Lumens allocated
 */
const amount = document.querySelector('[data-id="contribution"]');

const boards = {
  all: [],
  first: [],
  second: [],
};

/**
 * Update HTML
 */
const board1 = document.querySelector('[data-id="board"]');
const board2 = document.querySelector('[data-id="board-2"]');
const accountIdInput = document.querySelector('input[data-account-id]');

class DonationPage {
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

      boards.all.unshift({
        amount,
        date: `${date.toLocaleString()}`,
        id: responseData.id,
        memo: responseData.memo_type === 'text' ? responseData.memo : '🎉 Thank you!',
      });

      this.arrangeBoards();
      this.updateBoards();
      this.updateSummary();
    });
  }

  updatePayments() {
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

  arrangeBoards() {
    // Limit maximum to 99
    boards.all.length = 99;

    // Reset individual boards
    boards.first = [];
    boards.second = [];

    // Sort boards by amount
    const sortedBoards = boards.all.slice(0).sort(function (a, b) {
      return b.amount - a.amount;
    });

    // Use top 5 sorted entries
    boards.first = sortedBoards.slice(0, this.state.topList);

    // Save indices for the next step to save time
    const firstIndices = boards.first.map((entry) => {
      return entry.id;
    });

    // Use unsorted entries for second board
    boards.all.forEach((entry) => {
      if (firstIndices.indexOf(entry.id) === -1) {
        boards.second.push(entry);
      }
    });
  }

  updateBoards() {
    bind(board1)`
    ${
      boards.first.map((item) => {
        return wire(item)`
          <li>
            <span class="memo">${item.memo}</span>
            <span class="contribution">${item.amount} XLM – ${item.date}</span>
          </li>`;
      }
    )}`;

    bind(board2)`
    ${
      boards.second.map((item) => {
        return wire(item)`
          <li>
            <span class="memo">${item.memo}</span>
            <span class="contribution">${item.amount} XLM – ${item.date}</span>
          </li>`;
      }
    )}`;
  }
}

new DonationPage();
