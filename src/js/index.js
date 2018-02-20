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

const server = new Server(CONFIG.serverUrl);

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

class DonationPage {
  constructor() {
    this.streamManager = new PaymentsManager(server);

    this.updatePayments();
    this.updateSummary();
  }

  /**
   * Handle each incoming transaction individually
   */
  handleIncomingTransaction(response) {
    response.transaction().then((responseData) => {
      const amount = parseFloat(response.amount).toFixed(2);
      const isEnough = amount >= CONFIG.minimumAmount;

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
    this.streamManager.updateStream(CONFIG.accountId, this.handleIncomingTransaction.bind(this));
  }

  /**
   * This represents the text displayed at the very top of the page.
   */
  updateSummary(accountId = CONFIG.accountId) {
    server.loadAccount(accountId)
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
    boards.first = sortedBoards.slice(0, CONFIG.topList);

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
