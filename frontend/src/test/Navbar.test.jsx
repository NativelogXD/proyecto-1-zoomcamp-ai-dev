import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../components/Navbar';

describe('Navbar Component', () => {
  it('displays brand name and system status badge', () => {
    const onRefresh = vi.fn();
    render(<Navbar systemStatus="OPERATIONAL" onRefresh={onRefresh} />);

    expect(screen.getByText('CloudOps Commander')).toBeInTheDocument();
    expect(screen.getByText('OPERATIONAL')).toBeInTheDocument();

    const refreshBtn = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshBtn);
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
