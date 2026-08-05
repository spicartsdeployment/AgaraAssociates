import * as React from "react";
import { cx } from "@/lib/utils";
import "./Input.scss";

const Input = React.forwardRef(({ className, type, ...props }, ref) => (<input type={type} className={cx("input", className)} ref={ref} {...props}/>));
Input.displayName = "Input";
export { Input };
export default Input;
