import '../scss/index.scss';

import React from 'react';
import {
  render,
} from 'react-dom';

import DonationPage from './pages/donations';

render(<DonationPage />, document.querySelector('[data-root="react"]'));
