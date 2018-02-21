import '../scss/index.scss';

import React from 'react';
import {
  render,
} from 'react-dom';

import DonationPage from './pages/donations/page';
import DonationBoards from './pages/donations/boards';

new DonationPage();

render(<DonationBoards />, document.querySelector('[data-react-root="donation-boards"]'));
