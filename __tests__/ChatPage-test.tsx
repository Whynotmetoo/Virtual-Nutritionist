import { render, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import ChatPage from '@/app/(tabs)/index';

describe('<ChatPage />', () => {
  test('Text renders correctly on HomeScreen', async () => {
    const { findByText } = render(
      <SafeAreaProvider>
        <ChatPage />
      </SafeAreaProvider>
    );

    await waitFor(() => {
      findByText('Chat');
    });
  });
});
