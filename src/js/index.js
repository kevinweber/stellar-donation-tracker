import '../scss/index.scss';
import {
  live as CONFIG,
  // testnet as CONFIG,
} from './config';
import {
  Server,
} from 'stellar-sdk';

const {
  bind,
  wire,
} = window.hyperHTML;

const server = new Server(CONFIG.serverUrl);

/**
 * Display amount of Lumens allocated
 */
const amount = document.querySelector('[data-id="contribution"]');

function updateSummary() {
  server.loadAccount(CONFIG.accountId)
    .then((response) => {
      const balance = parseFloat(response.balances[0].balance).toFixed(2);
      bind(amount)`${balance} lumens (XLM) contributed so far. Keep rocking :-)`;
    });
}

const boards = {
  all: [],
  first: [],
  second: [],
};

function arrangeBoards() {
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

/**
 * Update HTML
 */
const board1 = document.querySelector('[data-id="board"]');
const board2 = document.querySelector('[data-id="board-2"]');

/**
 * "I'm sorry"
 */
function updateBoards() {
  arrangeBoards();

  bind(board1)`${
    boards.first.map((item) => {
      return wire(item)`
        <li>
          <span class="memo">${item.memo}</span>
          <span class="contribution">${item.amount} XLM – ${item.date}</span>
        </li>`;
    }
  )}`;

  bind(board2)`${
    boards.second.map((item) => {
      return wire(item)`
        <li>
          <span class="memo">${item.memo}</span>
          <span class="contribution">${item.amount} XLM – ${item.date}</span>
        </li>`;
    }
  )}`;
}

/**
 * Handle each incoming payment individually
 */
function handlePayment(response) {
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

    updateBoards();
    updateSummary();
  });
}

updateSummary();

/**
 * Request all payments from server & keep connection open
 */
server.payments()
  .forAccount(CONFIG.accountId)
  .limit(200)
  .stream({
    onmessage: handlePayment
  });
