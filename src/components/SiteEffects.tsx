'use client';

import { useEffect } from 'react';

/**
 * Page-wide motion layer, mounted once in the root layout:
 * - fades sections (and their cards, staggered) up as they scroll into view
 * - drives the cursor spotlight glow on `.card-dark-gradient` cards
 *
 * Elements only get the hidden "pending" state when this script runs, so if
 * JavaScript is slow or disabled every section is still fully visible.
 */
export function SiteEffects() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanups: Array<() => void> = [];

    if (!reduceMotion && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            el.classList.replace('reveal-pending', 'reveal-in');
            el.querySelectorAll<HTMLElement>('.reveal-pending').forEach((child) => {
              child.classList.replace('reveal-pending', 'reveal-in');
            });
            observer.unobserve(el);
          });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0 }
      );

      const setup = () => {
        document.querySelectorAll<HTMLElement>('main > section:not(:first-child)').forEach((section) => {
          if (section.dataset.revealReady) return;
          section.dataset.revealReady = '1';
          // Anything already on screen stays visible — no flash on load
          if (section.getBoundingClientRect().top < window.innerHeight * 0.9) return;

          section.classList.add('reveal-pending');
          const indexByParent = new Map<Element, number>();
          section.querySelectorAll<HTMLElement>('.card-dark-gradient').forEach((card) => {
            const parent = card.parentElement!;
            const i = indexByParent.get(parent) ?? 0;
            indexByParent.set(parent, i + 1);
            card.style.setProperty('--reveal-delay', `${Math.min(i, 6) * 70 + 120}ms`);
            card.classList.add('reveal-pending');
          });
          observer.observe(section);
        });
      };

      // Wait a frame so hydration has settled before touching classes
      const raf = requestAnimationFrame(setup);
      cleanups.push(() => {
        cancelAnimationFrame(raf);
        observer.disconnect();
      });
    }

    // Cursor spotlight on cards (pointer devices only)
    if (window.matchMedia('(hover: hover)').matches) {
      let frame = 0;
      let last: PointerEvent | null = null;
      const onMove = (e: PointerEvent) => {
        last = e;
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          const card = (last?.target as Element | null)?.closest?.<HTMLElement>('.card-dark-gradient');
          if (!card || !last) return;
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--mx', `${last.clientX - rect.left}px`);
          card.style.setProperty('--my', `${last.clientY - rect.top}px`);
        });
      };
      document.addEventListener('pointermove', onMove, { passive: true });
      cleanups.push(() => {
        document.removeEventListener('pointermove', onMove);
        cancelAnimationFrame(frame);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
