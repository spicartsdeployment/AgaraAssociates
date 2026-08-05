import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cx } from "@/lib/utils";
import "@/assets/styles/components/ScrollArea.scss";

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (<ScrollAreaPrimitive.Root ref={ref} className={cx("scroll-area", className)} {...props}>
    <ScrollAreaPrimitive.Viewport className="scroll-area__viewport">{children}</ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => (<ScrollAreaPrimitive.ScrollAreaScrollbar ref={ref} orientation={orientation} className={cx("scroll-area__scrollbar", orientation === "vertical" ? "scroll-area__scrollbar--vertical" : "scroll-area__scrollbar--horizontal", className)} {...props}>
    <ScrollAreaPrimitive.ScrollAreaThumb className="scroll-area__thumb"/>
  </ScrollAreaPrimitive.ScrollAreaScrollbar>));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;
export { ScrollArea, ScrollBar };
