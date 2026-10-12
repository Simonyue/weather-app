import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorAlert } from '../../components/common/ErrorAlert';

describe('ErrorAlert component', () => {
  it('renders default title and error message correctly', () => {
    render(<ErrorAlert message="服务器连接异常" />);
    expect(screen.getByText('天气数据加载失败')).toBeInTheDocument();
    expect(screen.getByText('服务器连接异常')).toBeInTheDocument();
  });

  it('renders custom title when provided', () => {
    render(<ErrorAlert title="位置解析错误" message="请检查输入" />);
    expect(screen.getByText('位置解析错误')).toBeInTheDocument();
  });

  it('calls onRetry callback when retry button is clicked', () => {
    const handleRetry = vi.fn();
    render(<ErrorAlert message="连接中断" onRetry={handleRetry} />);

    const retryButton = screen.getByRole('button', { name: /重新加载/i });
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
