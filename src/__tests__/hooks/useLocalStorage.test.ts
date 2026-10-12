import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useLocalStorage } from '../../hooks/useLocalStorage';

describe('useLocalStorage hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns initial value when key does not exist', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('updates value in state and localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(JSON.parse(window.localStorage.getItem('test_key')!)).toBe('updated');
  });

  it('supports updater function', () => {
    const { result } = renderHook(() => useLocalStorage('count_key', 1));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(2);
  });
});
