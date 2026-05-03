import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  type WheelEvent,
  type MouseEvent as RMouseEvent,
} from 'react';

interface GridContainerProps {
  children: ReactNode;
}

interface Transform {
  scale: number;
  x: number;
  y: number;
}

const MIN_SCALE = 0.4;
const MAX_SCALE = 3.5;
const ZOOM_SENSITIVITY = 0.001;

/**
 * CSS-transform based pan / zoom wrapper.
 * Why CSS transform (not SVG viewport or canvas): the grid is a DOM grid,
 * so the cheapest zoom is transform:scale on a wrapper div — zero layout
 * recalculation, GPU composited, 60fps.
 */
export default function GridContainer({ children }: GridContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<Transform>({ scale: 1, x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, tx: 0, ty: 0 });

  const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

  // ── Zoom (wheel) ────────────────────────────────────────────────────────
  const onWheel = useCallback((e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = containerRef.current!.getBoundingClientRect();

    setTransform((prev) => {
      const delta = -e.deltaY * ZOOM_SENSITIVITY;
      const newScale = clampScale(prev.scale + delta * prev.scale);
      const ratio = newScale / prev.scale;

      // Zoom toward the cursor position
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      return {
        scale: newScale,
        x: mx - ratio * (mx - prev.x),
        y: my - ratio * (my - prev.y),
      };
    });
  }, []);

  // ── Pan (drag) ──────────────────────────────────────────────────────────
  const onMouseDown = useCallback((e: RMouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      tx: transform.x,
      ty: transform.y,
    };
  }, [transform.x, transform.y]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - dragStart.current.mouseX;
      const dy = e.clientY - dragStart.current.mouseY;
      setTransform((prev) => ({
        ...prev,
        x: dragStart.current.tx + dx,
        y: dragStart.current.ty + dy,
      }));
    };
    const onMouseUp = () => { isDragging.current = false; };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const resetView = () => setTransform({ scale: 1, x: 0, y: 0 });

  return (
    <div className="relative w-full h-full overflow-hidden bg-brand-900 rounded-xl border border-brand-600/40">
      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        {[
          { label: '+', action: () => setTransform((p) => ({ ...p, scale: clampScale(p.scale * 1.25) })) },
          { label: '−', action: () => setTransform((p) => ({ ...p, scale: clampScale(p.scale * 0.8) })) },
          { label: '⌂', action: resetView },
        ].map(({ label, action }) => (
          <button
            key={label}
            onClick={action}
            className="w-7 h-7 flex items-center justify-center rounded bg-brand-700/80 hover:bg-brand-600 text-slate-300 hover:text-white text-xs font-mono border border-brand-600/60 transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Scale indicator */}
      <div className="absolute bottom-3 right-3 z-10 text-xs font-mono text-slate-500">
        {Math.round(transform.scale * 100)}%
      </div>

      {/* Pannable / zoomable canvas */}
      <div
        ref={containerRef}
        className="w-full h-full"
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
      >
        <div
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: '0 0',
            willChange: 'transform',
            display: 'inline-block',
            padding: '24px',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
