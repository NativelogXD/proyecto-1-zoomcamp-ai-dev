import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MetricSummary from '../components/MetricSummary';

describe('MetricSummary Component', () => {
  it('renders correctly with given system metrics', () => {
    const mockSummary = {
      total_services: 4,
      healthy_services: 3,
      active_incidents: 1,
      resolved_incidents: 15,
      system_status: 'DEGRADED',
    };

    render(<MetricSummary summary={mockSummary} />);

    expect(screen.getByText('Monitored Services')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('✓ 3 Healthy')).toBeInTheDocument();
    expect(screen.getByText('Active Incidents')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('renders null when summary is undefined', () => {
    const { container } = render(<MetricSummary summary={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
