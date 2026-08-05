import * as React from "react";
import { cx } from "@/lib/utils";
import "./Textarea.scss";

const Textarea = React.forwardRef(({ className, ...props }, ref) => (<textarea className={cx("textarea", className)} ref={ref} {...props}/>));
Textarea.displayName = "Textarea";
export { Textarea };
export default Textarea;
