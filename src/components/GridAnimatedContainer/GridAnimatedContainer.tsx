import { useEffect, useRef } from "react";
import styles from "./GridAnimator.module.css";

/* MUST BE INSIDE ANOTHER CONTAINER FILLS UP THE ENTIRE CONTAINER */
function GridAnimator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const topLayerRef = useRef<HTMLDivElement>(null);
  let tapTimeout: ReturnType<typeof setTimeout> | null = null;

  useEffect(() => {
    const container = containerRef.current;
    const topLayer = topLayerRef.current;
    if (!container || !topLayer) return;

    // State
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let alpha = 0;
    let inside = false;

    const linearInterpolate = (
      oldVal: number,
      newVal: number,
      t: number
    ): number => oldVal + (newVal - oldVal) * t;

    const getCursorPosition = (evt: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      let clientX: number, clientY: number;

      if ("touches" in evt && evt.touches.length > 0) {
        clientX = evt.touches[0].clientX;
        clientY = evt.touches[0].clientY;
      } else if ("clientX" in evt) {
        clientX = evt.clientX;
        clientY = evt.clientY;
      } else {
        return;
      }

      targetX = clientX - rect.left;
      targetY = clientY - rect.top;
      inside = true;

      // If it's a touch, auto-disable after a short delay
      if ("touches" in evt) {
        if (tapTimeout) clearTimeout(tapTimeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        tapTimeout = setTimeout(() => {
          inside = false;
        }, 1000); // lasts for 200ms
      }
    };

    const handleMouseLeave = () => {
      inside = false;
    };

    const handleTouchMove = (evt: TouchEvent) => {
      if (tapTimeout) {
        clearTimeout(tapTimeout); // cancel auto-hide when dragging
        tapTimeout = null;
      }
      getCursorPosition(evt);
    };

    const handleTouchEnd = () => {
      inside = false;
    };

    const animate = () => {
      currentX = linearInterpolate(currentX, targetX, 0.015);
      currentY = linearInterpolate(currentY, targetY, 0.015);
      alpha = inside
        ? linearInterpolate(alpha, 1, 0.1)
        : linearInterpolate(alpha, 0, 0.05);

      topLayer.style.setProperty("--x", `${currentX}px`);
      topLayer.style.setProperty("--y", `${currentY}px`);
      topLayer.style.setProperty("--alpha", `${alpha.toFixed(2)}`);

      requestAnimationFrame(animate);
    };

    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("touchend", handleTouchEnd);

    container.addEventListener("mousemove", getCursorPosition);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("touchstart", getCursorPosition);
    container.addEventListener("touchmove", getCursorPosition);
    container.addEventListener("touchend", handleMouseLeave);

    requestAnimationFrame(animate);

    return () => {
      container.removeEventListener("mousemove", getCursorPosition);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("touchstart", getCursorPosition);
      container.removeEventListener("touchmove", getCursorPosition);
      container.removeEventListener("touchend", handleMouseLeave);
    };
  }, []);

  return (
    <div className={`${styles.box}`} ref={containerRef}>
      <div className={`${styles["grid-bottom-layer"]}`}></div>
      <div className={`${styles["grid-top-layer"]}`} ref={topLayerRef}></div>
    </div>
  );
}

export default GridAnimator;
