import { act, render, screen } from '@testing-library/react';
import RootLayout from './layout';

describe('RootLayout', () => {
  beforeAll(() => {
    vi.mock('next/font/google', () => ({
      Geist: () => ({
        variable: '--font-sans',
      }),
    }));

    vi.mock('next/headers', () => ({
      headers: async () => new Map([['accept-language', 'en']]),
    }));
  });

  it('should render its children', async () => {
    await act(async () => {
      render(
        <RootLayout>
          <div data-testid="child">Test Child</div>
        </RootLayout>,
      );
    });

    const child = screen.getByTestId('child');
    expect(child).toBeDefined();
    expect(child.textContent).toBe('Test Child');
  });
});
