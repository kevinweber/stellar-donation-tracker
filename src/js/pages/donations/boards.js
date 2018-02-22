import React from 'react';
import PropTypes from 'prop-types';

class BoardItem extends React.Component {
  render() {
    if (!this.props.meta) {
      return;
    }

    return (
      <li>
        <span className="memo">{this.props.meta.memo}</span>
        <span className="contribution">{this.props.meta.amount} XLM – {this.props.meta.date}</span>
      </li>
    );
  }
}

BoardItem.propTypes = {
  meta: PropTypes.object,
};

class Board extends React.Component {
  render() {
    return (
      <ul className={this.props.className}>
        {this.props.items.map(function(item, i){
          return <BoardItem meta={item} key={i} />;
        })}
      </ul>
    );
  }
}

Board.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array,
};

export default class DonationBoards extends React.Component {
  getArrangedItems() {
    const arrangement = {
      board1: [],
      board2: [],
    };

    // Sort boards by amount
    const sortedItems = this.props.payments.slice(0).sort(function (a, b) {
      return b.amount - a.amount;
    });

    // Use top sorted entries
    arrangement.board1 = sortedItems.slice(0, this.props.topListLength);

    // Save indices for the next step to save time
    const firstIndices = arrangement.board1.map((entry) => {
      return entry.id;
    });

    // Use unsorted entries for second board
    this.props.payments.forEach((entry) => {
      if (firstIndices.indexOf(entry.id) === -1) {
        arrangement.board2.push(entry);
      }
    });

    return arrangement;
  }

  render() {
    if (this.props.payments.length === 0) {
      return (
        <section>
         <span className="memo">Loading...</span>
       </section>
     );
    }

    const arrangedItems = this.getArrangedItems();

    return (
      <section>
        <Board className="toplist" items={arrangedItems.board1} />
        <Board className="longlist" items={arrangedItems.board2} />
      </section>
    );
  }
}

DonationBoards.propTypes = {
  payments: PropTypes.array,
  topListLength: PropTypes.number,
};
