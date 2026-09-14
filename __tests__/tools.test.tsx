import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LocationFinder from '../src/components/Tools/LocationFinder';
import CalendarSync from '../src/components/Tools/CalendarSync';
import VoterIDCard from '../src/components/Tools/VoterIDCard';
import CivicQuiz from '../src/components/Tools/CivicQuiz';

describe('Civic Tools Suite', () => {
  it('renders LocationFinder completely', () => {
    render(<LocationFinder />);
    expect(screen.getByText(/Directory Link/i)).toBeInTheDocument();
    
    // Simulate search
    const input = screen.getByPlaceholderText(/Search City/i);
    fireEvent.change(input, { target: { value: 'Delhi' } });
    expect(screen.getAllByText(/District Election Office/i)[0]).toBeInTheDocument();
  });

  it('renders CalendarSync utility', () => {
    render(<CalendarSync />);
    expect(screen.getByText(/Critical Deadlines/i)).toBeInTheDocument();
  });

  it('renders VoterIDCard generator', () => {
    render(<VoterIDCard />);
    expect(screen.getByText(/Identity Simulator/i)).toBeInTheDocument();
  });

  it('renders Civic Quiz gateway', () => {
    render(<CivicQuiz />);
    expect(screen.getByText(/minimum age to vote/i)).toBeInTheDocument();
    
    // Simulate selecting option
    const option = screen.getByText("18");
    fireEvent.click(option);
    expect(option).toBeInTheDocument();
  });
});
