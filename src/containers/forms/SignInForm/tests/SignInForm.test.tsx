import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, waitFor } from '@testing-library/react';
import SignInForm from '../SignInForm';
import { signInMutation } from '@/graphql/mutations/signIn';

const mockMutationFn = jest.fn(() => Promise.resolve());

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useMutation: jest.fn(() => [mockMutationFn, {}]),
}));

const mocks = [
  {
    request: {
      query: signInMutation,
      variables: { input: { identifier: 'test@example.com', password: 'password123' } },
    },
    result: {
      data: {
        login: {
          __typename: 'Item',
          userId: '123',
          twoFactorRequired: false,
          jwt: 'mock-jwt',
          twoFASecret: 'mock-two-fa-secret',
        },
      },
    },
  },
];

describe('SignInForm', () => {
  it('renders correctly', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={mocks}>
        <SignInForm onSuccess={() => {}} />
      </MockedProvider>
    );
    
    expect(getByTestId('email-input')).toBeDefined();
    expect(getByTestId('password-input')).toBeDefined();
    expect(getByTestId('login-button')).toBeDefined();

    fireEvent.change(getByTestId('email-input'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByTestId('password-input'), { target: { value: 'password123' } });

    fireEvent.click(getByTestId('login-button'));

    await waitFor(() => {
      expect(mockMutationFn).toHaveBeenCalledWith({ variables: { input: { identifier: 'test@example.com', password: 'password123' } } });
    });
  });
});
