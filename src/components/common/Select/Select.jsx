import * as React from "react";
import { cx } from "@/lib/utils";
import "./Select.scss";

const Select = React.forwardRef(({ className, children, ...props }, ref) => (<select className={cx("select", className)} ref={ref} {...props}>
      {children}
    </select>));
Select.displayName = "Select";
export { Select };
export default Select;
