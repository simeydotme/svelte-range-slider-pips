type ClickOutsideEvent = CustomEvent<void>;

interface ClickOutsideOptions {
  enabled?: boolean;
}

export function clickOutside(node: HTMLElement, options: ClickOutsideOptions = {}) {
  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (options.enabled !== false && node && !node.contains(target)) {
      node.dispatchEvent(new CustomEvent('clickOutside'));
    }
  };

  document.addEventListener('click', handleClick, true);

  return {
    update(newOptions: ClickOutsideOptions) {
      options = newOptions;
    },
    destroy() {
      document.removeEventListener('click', handleClick, true);
    }
  };
}

// Add TypeScript support for the custom event
declare global {
  interface HTMLElementEventMap {
    clickOutside: ClickOutsideEvent;
  }
}
