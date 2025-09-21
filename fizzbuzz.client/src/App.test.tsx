import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock the child components
jest.mock('./components/Game/Game', () => ({
  Game: () => <div data-testid="game-component">Game Component</div>,
}));

jest.mock('./components/Admin/AdminPanel', () => ({
  AdminPanel: () => <div data-testid="admin-component">Admin Component</div>,
}));

describe('App', () => {
  test('renders header with navigation', () => {
    render(<App />);
    expect(screen.getByText('FizzBuzz Game')).toBeInTheDocument();
    expect(screen.getByText('Play Game')).toBeInTheDocument();
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  test('shows game component by default', () => {
    render(<App />);
    expect(screen.getByTestId('game-component')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-component')).not.toBeInTheDocument();
  });

  test('switches to admin panel when admin button is clicked', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Admin Panel'));
    expect(screen.getByTestId('admin-component')).toBeInTheDocument();
    expect(screen.queryByTestId('game-component')).not.toBeInTheDocument();
  });

  test('switches back to game when play game button is clicked', () => {
    render(<App />);
    // Switch to admin first
    fireEvent.click(screen.getByText('Admin Panel'));
    expect(screen.getByTestId('admin-component')).toBeInTheDocument();

    // Switch back to game
    fireEvent.click(screen.getByText('Play Game'));
    expect(screen.getByTestId('game-component')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-component')).not.toBeInTheDocument();
  });
});
