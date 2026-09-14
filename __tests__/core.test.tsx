import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from '../src/app/page';

describe('Electra Core Interface', () => {
  it('renders the primary hero title with national branding', () => {
    render(<Home />);
    const title = screen.getAllByText(/ELECTRA/i)[0];
    expect(title).toBeInTheDocument();
  });

  it('contains the essential civic tools', () => {
    render(<Home />);
    expect(screen.getAllByText(/Network Stats/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Path to Polls/i)[0]).toBeInTheDocument();
  });
});
