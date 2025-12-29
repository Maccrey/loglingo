import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { trackEvent } from './analytics';

describe('analytics utility', () => {
  let originalWindow: any;

  beforeEach(() => {
    originalWindow = global.window;
    
    // Mock window with gtag
    vi.stubGlobal('window', {
      gtag: vi.fn(),
    });

    // Mock import needed for firebase-analytics side-effect
    vi.mock('./firebase-analytics', () => ({
      logAnalyticsEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  it('should handle legacy events with correct labelling', () => {
    trackEvent('page_view', { page_path: '/home' });

    expect((window as any).gtag).toHaveBeenCalledWith(
      'event', 
      'page_view', 
      expect.objectContaining({
        language: 'ko',
        event_label: '페이지 조회',
        page_path: '/home'
      })
    );
  });

  it('should handle new structured events (English Key + Korean Value)', () => {
    trackEvent('click_button', {
      component_name: '네비게이션',
      action_detail: '테스트 버튼 클릭',
      value_korean: '테스트용 버튼입니다'
    });

    expect((window as any).gtag).toHaveBeenCalledWith(
      'event', 
      'click_button', 
      expect.objectContaining({
        language: 'ko',
        component_name: '네비게이션',
        action_detail: '테스트 버튼 클릭',
        value_korean: '테스트용 버튼입니다'
      })
    );
  });
});
