import { render, screen } from '@testing-library/react';
import RootLayout from './layout';

describe('RootLayout', () => {
  beforeAll(() => {
    vi.mock('next/font/google', () => ({
      Geist: () => ({
        variable: '--font-sans',
      }),
    }));
  });

  it('should render its children', () => {
    render(
      <RootLayout>
        <div data-testid="child">Test Child</div>
      </RootLayout>,
    );

    const child = screen.getByTestId('child');
    expect(child).toBeDefined();
    expect(child.textContent).toBe('Test Child');
  });
});
