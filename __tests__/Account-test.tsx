import { render, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import AccountPage from '@/app/(tabs)/account';

describe('<AccountPage />', () => {
  test('Text renders correctly on HomeScreen', async () => {
    const { findByText } = render(<SafeAreaProvider><AccountPage />)</SafeAreaProvider>);

    await waitFor(() => {
      findByText('Logout');
    });
  });
});
