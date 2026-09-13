import { AnimatePresence, motion } from "motion/react"
import type { ReactElement, ReactNode, Ref } from "react"
import { cloneElement, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

export type TooltipPlacement =
    | "top"
    | "top-left"
    | "top-right"
    | "bottom"
    | "bottom-left"
    | "bottom-right"
    | "left"
    | "left-top"
    | "left-bottom"
    | "right"
    | "right-top"
    | "right-bottom";

interface TooltipProps {
    label: ReactNode;
    placement?: TooltipPlacement;
    offset?: number;
    disabled?: boolean;
    children: ReactElement;
}

interface Position {
    top: number;
    left: number;
}

type Size = { width: number; height: number };
type Side = "top" | "bottom" | "left" | "right";

// How close the tooltip is allowed to get to the viewport edge before it's
// considered clipped.
const VIEWPORT_MARGIN = 8;

const baseSide = (placement: TooltipPlacement): Side => placement.split("-")[0] as Side;

const oppositeSide = (side: Side): Side =>
    ({ top: "bottom", bottom: "top", left: "right", right: "left" } as const)[side];

// Computes the tooltip's top-left corner in viewport coordinates for a given
// placement, using the tooltip's *actual measured size* rather than a CSS
// percentage transform. Knowing the real box lets `resolvePosition` below
// test it against the viewport and correct it — the same reason Popper /
// Floating UI (which MUI's Tooltip is built on) always measure the floating
// element before finalizing its position.
function place(anchor: DOMRect, size: Size, placement: TooltipPlacement, offset: number): Position {
    switch (placement) {
        case "top":
            return { top: anchor.top - offset - size.height, left: anchor.left + anchor.width / 2 - size.width / 2 };
        case "top-left":
            return { top: anchor.top - offset - size.height, left: anchor.left - size.width };
        case "top-right":
            return { top: anchor.top - offset - size.height, left: anchor.right };
        case "bottom":
            return { top: anchor.bottom + offset, left: anchor.left + anchor.width / 2 - size.width / 2 };
        case "bottom-left":
            return { top: anchor.bottom + offset, left: anchor.left - size.width };
        case "bottom-right":
            return { top: anchor.bottom + offset, left: anchor.right };
        case "left":
            return { top: anchor.top + anchor.height / 2 - size.height / 2, left: anchor.left - offset - size.width };
        case "left-top":
            return { top: anchor.top, left: anchor.left - offset - size.width };
        case "left-bottom":
            return { top: anchor.bottom - size.height, left: anchor.left - offset - size.width };
        case "right-top":
            return { top: anchor.top, left: anchor.right + offset };
        case "right-bottom":
            return { top: anchor.bottom - size.height, left: anchor.right + offset };
        case "right":
        default:
            return { top: anchor.top + anchor.height / 2 - size.height / 2, left: anchor.right + offset };
    }
}

function fitsInViewport(pos: Position, size: Size): boolean {
    return (
        pos.top >= VIEWPORT_MARGIN &&
        pos.left >= VIEWPORT_MARGIN &&
        pos.top + size.height <= window.innerHeight - VIEWPORT_MARGIN &&
        pos.left + size.width <= window.innerWidth - VIEWPORT_MARGIN
    );
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

// Mirrors Popper/Floating UI's "flip" + "shift" modifiers: try the requested
// placement first; if it would clip against the viewport, flip to the
// opposite side of the same axis (keeping the left/right or top/bottom
// sub-alignment); then clamp within the viewport as a last resort, so the
// tooltip is never cut off even when flipping alone isn't enough room.
function resolvePosition(anchor: DOMRect, size: Size, placement: TooltipPlacement, offset: number): Position {
    const preferred = place(anchor, size, placement, offset);
    if (fitsInViewport(preferred, size)) return preferred;

    const side = baseSide(placement);
    const flippedPlacement = placement.replace(side, oppositeSide(side)) as TooltipPlacement;
    const flipped = place(anchor, size, flippedPlacement, offset);
    const candidate = fitsInViewport(flipped, size) ? flipped : preferred;

    return {
        top: clamp(candidate.top, VIEWPORT_MARGIN, window.innerHeight - size.height - VIEWPORT_MARGIN),
        left: clamp(candidate.left, VIEWPORT_MARGIN, window.innerWidth - size.width - VIEWPORT_MARGIN),
    };
}

const mergeRefs = <T,>(...refs: Array<Ref<T> | undefined>) => (node: T) => {
    refs.forEach((ref) => {
        if (typeof ref === "function") ref(node);
        else if (ref && typeof ref === "object") (ref as { current: T | null }).current = node;
    });
};

/**
 * Wraps a single child element and shows a floating label near it on hover/focus.
 * Hyphenated placements position the tooltip on that side of the target;
 * for example, `bottom-left` places it below and extending toward the target's left.
 * Portaled to `document.body`, so it always escapes clipping ancestors (e.g. `overflow-hidden`).
 *
 * Positioning is collision-aware: if the preferred placement would clip
 * against the viewport edge, it flips to the opposite side and, failing
 * that, clamps within the viewport — and it stays correct across scroll/resize
 * while visible, instead of freezing at the position captured on hover.
 */
export const Tooltip = ({ label, placement = "top", offset = 8, disabled, children }: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isPositioned, setIsPositioned] = useState(false);
    const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
    const anchorRef = useRef<HTMLElement>(null);
    const tooltipRef = useRef<HTMLSpanElement>(null);

    const reposition = () => {
        if (!anchorRef.current || !tooltipRef.current) return;
        const anchorRect = anchorRef.current.getBoundingClientRect();
        const size = tooltipRef.current.getBoundingClientRect();
        setPosition(resolvePosition(anchorRect, size, placement, offset));
    };

    // Runs synchronously after the (still invisible) tooltip mounts and
    // before the browser paints, so the corrected position is what actually
    // gets shown — no flash at the wrong spot first.
    useLayoutEffect(() => {
        if (!isVisible) {
            setIsPositioned(false);
            return;
        }

        reposition();
        setIsPositioned(true);

        const handle = () => reposition();
        window.addEventListener("scroll", handle, true);
        window.addEventListener("resize", handle);

        // The tooltip's own size can change after this first measurement —
        // most commonly because the label's webfont (`font-display: swap`)
        // hasn't finished loading yet, so it's briefly measured in a
        // narrower fallback font. A ResizeObserver on the tooltip itself
        // (rather than a one-off font-ready check) catches that and any
        // other post-mount size change generically, the same way
        // floating-ui's `autoUpdate` keeps a floating element correctly
        // placed as it resizes.
        const observer = new ResizeObserver(handle);
        if (tooltipRef.current) observer.observe(tooltipRef.current);

        return () => {
            window.removeEventListener("scroll", handle, true);
            window.removeEventListener("resize", handle);
            observer.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible, placement, offset]);

    const show = () => {
        if (!disabled) setIsVisible(true);
    };

    const hide = () => setIsVisible(false);

    const childRef = (children as unknown as { ref?: Ref<HTMLElement> }).ref;

    return (
        <>
            {cloneElement(children, {
                ref: mergeRefs(anchorRef, childRef),
                onMouseEnter: show,
                onMouseLeave: hide,
                onFocus: show,
                onBlur: hide,
            } as Record<string, unknown>)}

            {!disabled &&
                createPortal(
                    <AnimatePresence>
                        {isVisible && (
                            <motion.span
                                ref={tooltipRef}
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: isPositioned ? 1 : 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.12 }}
                                style={{ top: position.top, left: position.left }}
                                className="pointer-events-none fixed z-9999 w-max max-w-60 whitespace-nowrap rounded-lg bg-content px-3 py-1.5 text-nav font-medium text-ui-bg"
                            >
                                {label}
                            </motion.span>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
        </>
    );
};
