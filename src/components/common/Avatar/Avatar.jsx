import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cx } from "@/lib/utils";
import "./Avatar.scss";

const Avatar = React.forwardRef(({ className, ...props }, ref) => (<AvatarPrimitive.Root ref={ref} className={cx("avatar", className)} {...props}/>));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (<AvatarPrimitive.Image ref={ref} className={cx("avatar__image", className)} {...props}/>));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (<AvatarPrimitive.Fallback ref={ref} className={cx("avatar__fallback", className)} {...props}/>));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
export { Avatar, AvatarImage, AvatarFallback };
export default Avatar;
