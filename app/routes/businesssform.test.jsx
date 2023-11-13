import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import BusinessForm from './businessForm';

describe('BusinessForm Component', () => {
  it('renders form fields correctly', () => {
    const { getByLabelText } = render(<BusinessForm />);
    expect(getByLabelText('Store Name:')).toBeInTheDocument();
  });

  it('updates state on form input change', () => {
    const { getByLabelText } = render(<BusinessForm />);
    fireEvent.change(getByLabelText('Store Name:'), { target: { value: 'Test Store' } });
  });

  it('calls handleConnectShopify on "Connect with Shopify" button click', () => {
    const { getByText } = render(<BusinessForm />);
    const connectButton = getByText('Connect with Shopify');
    fireEvent.click(connectButton);
  });
});
