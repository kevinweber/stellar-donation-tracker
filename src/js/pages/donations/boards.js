const {
  bind,
  wire,
} = window.hyperHTML;

const BOARDS_INITIAL = {
  all: [],
  first: [],
  second: [],
};

const board1 = document.querySelector('[data-id="board"]');
const board2 = document.querySelector('[data-id="board-2"]');

export default class DonationBoards {
  constructor() {
    this.state = {
      boards: Object.assign({}, BOARDS_INITIAL),
    };

    return {
      addEntry: this.addEntry.bind(this),
      updateBoards: this.updateBoards.bind(this),
      resetBoards: this.resetBoards.bind(this),
    };
  }

  resetBoards() {
    this.state.boards = Object.assign({}, BOARDS_INITIAL);

    bind(board1)`
    <span class="memo">Loading...</span>`;

    bind(board2);
  }

  arrangeBoards() {
    // Limit maximum to 99
    this.state.boards.all.length = 99;

    // Reset individual boards
    this.state.boards.first = [];
    this.state.boards.second = [];

    // Sort boards by amount
    const sortedBoards = this.state.boards.all.slice(0).sort(function (a, b) {
      return b.amount - a.amount;
    });

    // Use top 5 sorted entries
    this.state.boards.first = sortedBoards.slice(0, this.state.topList);

    // Save indices for the next step to save time
    const firstIndices = this.state.boards.first.map((entry) => {
      return entry.id;
    });

    // Use unsorted entries for second board
    this.state.boards.all.forEach((entry) => {
      if (firstIndices.indexOf(entry.id) === -1) {
        this.state.boards.second.push(entry);
      }
    });
  }

  addEntry(entry) {
    this.state.boards.all.unshift(entry);
  }

  updateBoards() {
    this.arrangeBoards();

    bind(board1)`
    ${
      this.state.boards.first.map((item) => {
        return wire(item)`
          <li>
            <span class="memo">${item.memo}</span>
            <span class="contribution">${item.amount} XLM – ${item.date}</span>
          </li>`;
      }
    )}`;

    bind(board2)`
    ${
      this.state.boards.second.map((item) => {
        return wire(item)`
          <li>
            <span class="memo">${item.memo}</span>
            <span class="contribution">${item.amount} XLM – ${item.date}</span>
          </li>`;
      }
    )}`;
  }
}
