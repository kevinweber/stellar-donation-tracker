import React from 'react';

class BoardItem extends React.Component {
  render() {
    if (!this.props.meta) {
      return;
    }

    return (
      <li>
        <span className="memo">${this.props.meta.memo}</span>
        <span className="contribution">${this.props.meta.amount} XLM – ${this.props.meta.date}</span>
      </li>
    );
  }
}

class Board extends React.Component {
  render() {
    return (
      <ul className={this.props.className}>
        {this.props.items.map(function(item){
          return <BoardItem meta={item} />;
        })}
      </ul>
    );
  }
}

export default class DonationBoards extends React.Component {
  render() {
    if (this.props.payments.length === 0) {
      return (
        <section>
         <span className="memo">Loading...</span>
       </section>
     );
    }

    return [
      <section>
        <Board className="toplist" items={this.props.payments} />
      </section>,
      <section>
        <Board className="longlist" items={this.props.payments} />
      </section>,
    ];
  }

  // resetBoards() {
  //   this.state.boards = Object.assign({}, BOARDS_INITIAL);
  //
  //   // bind(board1)`
  //   // <span class="memo">Loading...</span>`;
  //
  //   bind(board2);
  // }
  //
  // arrangeBoards() {
  //   // Limit maximum to 99
  //   this.state.boards.all.length = 99;
  //
  //   // Reset individual boards
  //   this.state.boards.first = [];
  //   this.state.boards.second = [];
  //
  //   // Sort boards by amount
  //   const sortedBoards = this.state.boards.all.slice(0).sort(function (a, b) {
  //     return b.amount - a.amount;
  //   });
  //
  //   // Use top 5 sorted entries
  //   this.state.boards.first = sortedBoards.slice(0, this.state.topList);
  //
  //   // Save indices for the next step to save time
  //   const firstIndices = this.state.boards.first.map((entry) => {
  //     return entry.id;
  //   });
  //
  //   // Use unsorted entries for second board
  //   this.state.boards.all.forEach((entry) => {
  //     if (firstIndices.indexOf(entry.id) === -1) {
  //       this.state.boards.second.push(entry);
  //     }
  //   });
  // }
}
