// Mobile gesture handling and touch interactions

export interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  duration: number;
}

export interface GestureOptions {
  threshold: number; // Minimum distance for swipe detection
  restraint: number; // Maximum distance perpendicular to swipe direction
  allowedTime: number; // Maximum time for swipe
  preventDefault: boolean;
}

class MobileGestureManager {
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private touchStartTime: number = 0;
  private activeElement: HTMLElement | null = null;

  constructor() {
    this.setupGlobalGestures();
  }

  // Global gesture setup for navigation
  private setupGlobalGestures(): void {
    // Add swipe navigation for pages
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });

    // Prevent zoom on double tap for specific elements
    document.addEventListener('touchend', this.preventDoubleTabZoom.bind(this), { passive: false });

    // Add pull-to-refresh functionality
    this.setupPullToRefresh();
  }

  private handleTouchStart(event: TouchEvent): void {
    if (event.touches.length !== 1) return;

    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartTime = Date.now();
    this.activeElement = event.target as HTMLElement;
  }

  private handleTouchMove(event: TouchEvent): void {
    // Prevent default behavior for certain elements to enable custom gestures
    const target = event.target as HTMLElement;
    
    if (target.classList.contains('swipeable') || 
        target.closest('.swipeable') ||
        target.classList.contains('gesture-enabled')) {
      event.preventDefault();
    }
  }

  private handleTouchEnd(event: TouchEvent): void {
    if (event.changedTouches.length !== 1) return;

    const touch = event.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;
    const touchEndTime = Date.now();

    const swipe = this.detectSwipe(
      this.touchStartX, this.touchStartY,
      touchEndX, touchEndY,
      this.touchStartTime, touchEndTime
    );

    if (swipe) {
      this.handleGlobalSwipe(swipe);
    }
  }

  private detectSwipe(
    startX: number, startY: number,
    endX: number, endY: number,
    startTime: number, endTime: number,
    options: Partial<GestureOptions> = {}
  ): SwipeDirection | null {
    const defaultOptions: GestureOptions = {
      threshold: 50,
      restraint: 100,
      allowedTime: 500,
      preventDefault: true
    };

    const config = { ...defaultOptions, ...options };

    const distanceX = endX - startX;
    const distanceY = endY - startY;
    const elapsedTime = endTime - startTime;

    if (elapsedTime > config.allowedTime) return null;

    // Determine swipe direction
    if (Math.abs(distanceX) >= config.threshold && Math.abs(distanceY) <= config.restraint) {
      return {
        direction: distanceX > 0 ? 'right' : 'left',
        distance: Math.abs(distanceX),
        duration: elapsedTime
      };
    } else if (Math.abs(distanceY) >= config.threshold && Math.abs(distanceX) <= config.restraint) {
      return {
        direction: distanceY > 0 ? 'down' : 'up',
        distance: Math.abs(distanceY),
        duration: elapsedTime
      };
    }

    return null;
  }

  private handleGlobalSwipe(swipe: SwipeDirection): void {
    // Global navigation gestures
    const currentPath = window.location.pathname;

    switch (swipe.direction) {
      case 'right':
        // Navigate back or to previous page
        if (currentPath === '/predict') {
          window.location.href = '/';
        } else if (currentPath === '/results') {
          window.location.href = '/predict';
        }
        break;

      case 'left':
        // Navigate forward or to next page
        if (currentPath === '/') {
          window.location.href = '/predict';
        } else if (currentPath === '/predict') {
          // Check if form is filled before navigating
          const form = document.querySelector('form');
          if (form && this.isFormValid(form)) {
            window.location.href = '/results';
          }
        }
        break;

      case 'up':
        // Pull up chatbot or accessibility panel
        this.openBottomSheet();
        break;

      case 'down':
        // Pull to refresh
        this.triggerRefresh();
        break;
    }
  }

  private isFormValid(form: HTMLFormElement): boolean {
    const inputs = form.querySelectorAll('input[required], select[required]');
    return Array.from(inputs).every(input => {
      const inputElement = input as HTMLInputElement | HTMLSelectElement;
      return inputElement.value.trim() !== '';
    });
  }

  private openBottomSheet(): void {
    // Open chatbot or accessibility panel
    const chatbotToggle = document.querySelector('[data-chatbot-toggle]') as HTMLElement;
    const accessibilityButton = document.querySelector('.accessibility-button') as HTMLElement;
    
    if (chatbotToggle) {
      chatbotToggle.click();
    } else if (accessibilityButton) {
      accessibilityButton.click();
    }
  }

  private triggerRefresh(): void {
    // Add visual feedback for refresh
    this.showRefreshIndicator();
    
    // Refresh page data
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  private showRefreshIndicator(): void {
    const indicator = document.createElement('div');
    indicator.className = 'refresh-indicator';
    indicator.innerHTML = '↻ Refreshing...';
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #10b981;
      color: white;
      padding: 12px 24px;
      border-radius: 25px;
      z-index: 1000;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      animation: slideIn 0.3s ease;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(-50%) translateY(-100%); }
        to { transform: translateX(-50%) translateY(0); }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(indicator);

    setTimeout(() => {
      indicator.remove();
    }, 2000);
  }

  private preventDoubleTabZoom(event: TouchEvent): void {
    const target = event.target as HTMLElement;
    
    // Prevent double-tap zoom on buttons and form elements
    if (target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'SELECT' ||
        target.classList.contains('no-zoom')) {
      event.preventDefault();
    }
  }

  // Pull-to-refresh functionality
  private setupPullToRefresh(): void {
    let startY = 0;
    let currentY = 0;
    let isPulling = false;
    let refreshThreshold = 100;

    document.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (window.scrollY === 0 && startY > 0) {
        currentY = e.touches[0].clientY;
        const pullDistance = currentY - startY;

        if (pullDistance > 10) {
          isPulling = true;
          this.updatePullIndicator(pullDistance, refreshThreshold);
        }
      }
    }, { passive: true });

    document.addEventListener('touchend', () => {
      if (isPulling) {
        const pullDistance = currentY - startY;
        
        if (pullDistance >= refreshThreshold) {
          this.triggerRefresh();
        }
        
        this.hidePullIndicator();
        isPulling = false;
        startY = 0;
        currentY = 0;
      }
    }, { passive: true });
  }

  private updatePullIndicator(distance: number, threshold: number): void {
    let indicator = document.getElementById('pull-refresh-indicator');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'pull-refresh-indicator';
      indicator.innerHTML = '↓ Pull to refresh';
      indicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        background: #10b981;
        color: white;
        padding: 8px 16px;
        border-radius: 0 0 12px 12px;
        z-index: 1000;
        font-size: 14px;
        transition: all 0.2s ease;
        opacity: 0;
      `;
      document.body.appendChild(indicator);
    }

    const progress = Math.min(distance / threshold, 1);
    indicator.style.opacity = progress.toString();
    indicator.style.transform = `translateX(-50%) translateY(${Math.min(distance * 0.5, 50)}px)`;

    if (progress >= 1) {
      indicator.innerHTML = '↻ Release to refresh';
      indicator.style.background = '#059669';
    } else {
      indicator.innerHTML = '↓ Pull to refresh';
      indicator.style.background = '#10b981';
    }
  }

  private hidePullIndicator(): void {
    const indicator = document.getElementById('pull-refresh-indicator');
    if (indicator) {
      indicator.style.opacity = '0';
      indicator.style.transform = 'translateX(-50%) translateY(-100%)';
      setTimeout(() => {
        indicator.remove();
      }, 300);
    }
  }

  // Card swipe functionality for lists
  public enableCardSwipe(element: HTMLElement, onSwipeLeft?: () => void, onSwipeRight?: () => void): void {
    element.classList.add('swipeable');
    
    let startX = 0;
    let startY = 0;
    let currentTransform = 0;

    const resetTransform = () => {
      element.style.transform = '';
      element.style.transition = 'transform 0.3s ease';
    };

    const handleStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      element.style.transition = '';
    };

    const handleMove = (e: TouchEvent) => {
      const deltaX = e.touches[0].clientX - startX;
      const deltaY = e.touches[0].clientY - startY;

      // Only handle horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault();
        currentTransform = deltaX;
        element.style.transform = `translateX(${deltaX}px)`;
        
        // Add visual feedback
        if (deltaX > 50) {
          element.style.backgroundColor = '#dcfce7'; // Green for right swipe
        } else if (deltaX < -50) {
          element.style.backgroundColor = '#fef2f2'; // Red for left swipe
        } else {
          element.style.backgroundColor = '';
        }
      }
    };

    const handleEnd = () => {
      const absTransform = Math.abs(currentTransform);
      
      if (absTransform > 100) {
        if (currentTransform > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (currentTransform < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
      
      resetTransform();
      currentTransform = 0;
    };

    element.addEventListener('touchstart', handleStart, { passive: false });
    element.addEventListener('touchmove', handleMove, { passive: false });
    element.addEventListener('touchend', handleEnd);
  }

  // Haptic feedback
  public vibrate(pattern: number | number[] = 50): void {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  // Long press detection
  public enableLongPress(element: HTMLElement, callback: () => void, duration: number = 500): void {
    let pressTimer: NodeJS.Timeout;

    const start = () => {
      pressTimer = setTimeout(() => {
        this.vibrate([50, 100, 50]); // Haptic feedback
        callback();
      }, duration);
    };

    const cancel = () => {
      clearTimeout(pressTimer);
    };

    element.addEventListener('touchstart', start);
    element.addEventListener('touchend', cancel);
    element.addEventListener('touchmove', cancel);
  }

  // Device orientation detection
  public onOrientationChange(callback: (orientation: 'portrait' | 'landscape') => void): void {
    const checkOrientation = () => {
      const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
      callback(orientation);
    };

    window.addEventListener('orientationchange', checkOrientation);
    window.addEventListener('resize', checkOrientation);
    
    // Initial check
    checkOrientation();
  }

  // Performance optimization for scrolling
  public optimizeScrolling(): void {
    // Add momentum scrolling for iOS
    (document.body.style as any).webkitOverflowScrolling = 'touch';
    
    // Throttle scroll events
    let ticking = false;
    
    const updateOnScroll = () => {
      // Update scroll-based features
      this.updateScrollIndicators();
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  private updateScrollIndicators(): void {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    
    // Update any scroll indicators
    const indicators = document.querySelectorAll('.scroll-indicator');
    indicators.forEach(indicator => {
      (indicator as HTMLElement).style.width = `${scrollPercent}%`;
    });
  }
}

export const mobileGestureManager = new MobileGestureManager();