import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cx } from "@/lib/utils";
import "./Label.scss";

const Label = React.forwardRef(({ className, ...props }, ref) => (<LabelPrimitive.Root ref={ref} className={cx("label", className)} {...props}/>));
Label.displayName = LabelPrimitive.Root.displayName;
export { Label };
export default Label;
