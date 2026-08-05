import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cx } from "@/lib/utils";
import "@/assets/styles/components/Progress.scss";

const Progress = React.forwardRef(({ className, value, ...props }, ref) => {
    const indicatorRef = React.useRef(null);

    React.useLayoutEffect(() => {
        if (indicatorRef.current) {
            indicatorRef.current.style.setProperty("--progress-offset", `${100 - (value || 0)}%`);
        }
    }, [value]);

    return (<ProgressPrimitive.Root ref={ref} className={cx("progress", className)} {...props}>
        <ProgressPrimitive.Indicator ref={indicatorRef} className="progress__indicator"/>
    </ProgressPrimitive.Root>);
});
Progress.displayName = ProgressPrimitive.Root.displayName;
export { Progress };
