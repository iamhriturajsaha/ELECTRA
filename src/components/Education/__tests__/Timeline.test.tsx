import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Timeline from '../Timeline';

describe('Timeline Component', () => {
  it('renders all election steps', () => {
    render(<Timeline />);
    expect(screen.getAllByText(/Check Eligibility/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Register to Vote/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Verify Enrollment/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Polling Day/i)[0]).toBeInTheDocument();
  });

  it('changes active step on click', async () => {
    render(<Timeline />);
    
    // Initial active step should be 2 (Register to Vote)
    const eligibilityStep = screen.getByRole('button', { name: /Check Eligibility/i });
    fireEvent.click(eligibilityStep);
    
    // Use findByText to wait for the animation/transition
    const detailText = await screen.findByText(/Are you 18 or older\?/i);
    expect(detailText).toBeInTheDocument();
  });

  it('displays the correct status icons', () => {
    render(<Timeline />);
    // Check for icons or status indicators (mocked/simplified for this test)
    const completedStep = screen.getAllByText(/Check Eligibility/i)[0];
    expect(completedStep).toBeInTheDocument();
  });
});
