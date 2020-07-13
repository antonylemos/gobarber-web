import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import api from '../../services/api';

import ForgotPassword from '../../pages/ForgotPassword';

const mockedAddToast = jest.fn();

jest.mock('react-router-dom');

jest.mock('../../services/api');

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('ForgotPassword Page', () => {
  beforeEach(() => {
    mockedAddToast.mockClear();
  });

  it('should be able to forgot password', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const passwordField = getByPlaceholderText('E-mail');
    const buttonElement = getByText('Recuperar');

    fireEvent.change(passwordField, {
      target: { value: 'johndoe@example.com' },
    });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });

  it('should be able to forgot password with invalid email', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const passwordField = getByPlaceholderText('E-mail');
    const buttonElement = getByText('Recuperar');

    fireEvent.change(passwordField, {
      target: { value: 'not-valid-email' },
    });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).not.toHaveBeenCalledWith();
    });
  });

  it('should display an error if forgot fails', async () => {
    jest.spyOn(api, 'post').mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const passwordField = getByPlaceholderText('E-mail');
    const buttonElement = getByText('Recuperar');

    fireEvent.change(passwordField, {
      target: { value: 'johndoe@example.com' },
    });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
