import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cx } from "@/lib/utils";
import "@/assets/styles/components/Separator.scss";

const Separator = React.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (<SeparatorPrimitive.Root ref={ref} decorative={decorative} orientation={orientation} className={cx("separator", orientation === "horizontal" ? "separator--horizontal" : "separator--vertical", className)} {...props}/>));
Separator.displayName = SeparatorPrimitive.Root.displayName;
export { Separator };
