import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cx } from "@/lib/utils";
import "@/assets/styles/components/DropdownMenu.scss";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (<DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content ref={ref} sideOffset={sideOffset} className={cx("dropdown-menu__content", className)} {...props}/>
  </DropdownMenuPrimitive.Portal>));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => (<DropdownMenuPrimitive.Item ref={ref} className={cx("dropdown-menu__item", inset && "dropdown-menu__item--inset", className)} {...props}/>));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => (<DropdownMenuPrimitive.Label ref={ref} className={cx("dropdown-menu__label", inset && "dropdown-menu__label--inset", className)} {...props}/>));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (<DropdownMenuPrimitive.Separator ref={ref} className={cx("dropdown-menu__separator", className)} {...props}/>));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuPortal, };
