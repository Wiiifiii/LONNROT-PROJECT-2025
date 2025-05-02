import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../src/app/components/UI/Button';
import Tooltip from '@/app/components/UI/Tooltip'


describe('Button component', () => {
  // A dummy icon component for testing the `icon` prop
  const DummyIcon = () => <svg data-testid="icon" />;

  test('renders text, applies className and tooltip', () => {
    render(
      <Button
        text="Click me"
        tooltip="A helpful tooltip"
        className="custom-class"
      />
    );
    const button = screen.getByRole('button', { name: /click me/i });

    // Text content
    expect(button).toHaveTextContent('Click me');
    // Custom class applied
    expect(button).toHaveClass('custom-class');
    // Title attribute for tooltip
    expect(button).toHaveAttribute('title', 'A helpful tooltip');
  });

  test('renders icon when provided', () => {
    render(<Button text="With icon" icon={DummyIcon} />);
    // Should find our dummy SVG icon
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button text="Submit" onClick={handleClick} />);
    const button = screen.getByRole('button', { name: /submit/i });

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
