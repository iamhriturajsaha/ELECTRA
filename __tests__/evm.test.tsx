import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EVMSimulator from '../src/components/Tools/EVMSimulator';

describe('EVM Simulator Logic', () => {
  it('initializes in locked state', () => {
    render(<EVMSimulator />);
    expect(screen.getByText(/Identity Pending/i)).toBeInTheDocument();
  });

  it('allows biometric unlock sequence', async () => {
    render(<EVMSimulator />);
    const unlockBtn = screen.getByText(/Scan Biometrics/i);
    fireEvent.click(unlockBtn);
    expect(await screen.findByText(/Scanning Bio/i)).toBeInTheDocument();
  });
});
