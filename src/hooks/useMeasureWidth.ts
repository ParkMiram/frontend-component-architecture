import { useEffect, useRef, useState } from "react";

export function useMeasureWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    const measure = () => setWidth(el.offsetWidth);

    measure();

    const resizeObserver = new ResizeObserver(measure);

    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, []);

  return { ref, width };
}
