import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cx } from "@/lib/utils";
import "./Button.scss";

function buttonVariants({ variant = "default", size = "default", className } = {}) {
    return cx(
        "btn",
        `btn--${variant}`,
        size !== "default" && `btn--${size}`,
        className,
    );
}

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (<Comp className={buttonVariants({ variant, size, className })} ref={ref} {...props}/>);
});
Button.displayName = "Button";
export { Button, buttonVariants };
export default Button;
