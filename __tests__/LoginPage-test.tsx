import { render, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import LoginPage from '@/app/index';

describe('<LoginPage />', () => {
  test('Text renders correctly on HomeScreen', async () => {
    const { findByText } = render(
      <SafeAreaProvider>
        <LoginPage />
      </SafeAreaProvider>
    );
    await waitFor(() => {
      findByText('password');
    });
  });
});
