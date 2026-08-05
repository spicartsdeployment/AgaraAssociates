"use client";
import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { cx } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import "@/assets/styles/components/Command.scss";

const Command = React.forwardRef(({ className, ...props }, ref) => (<CommandPrimitive ref={ref} className={cx("command", className)} {...props}/>));
Command.displayName = CommandPrimitive.displayName;
const CommandDialog = ({ children, ...props }) => (<Dialog {...props}>
    <DialogContent className="dialog-content--command">
      <Command className="command--dialog">
        {children}
      </Command>
    </DialogContent>
  </Dialog>);
const CommandInput = React.forwardRef(({ className, ...props }, ref) => (<div className="command__input-wrapper" cmdk-input-wrapper="">
    <Search className="command__search-icon"/>
    <CommandPrimitive.Input ref={ref} className={cx("command__input", className)} {...props}/>
  </div>));
CommandInput.displayName = CommandPrimitive.Input.displayName;
const CommandList = React.forwardRef(({ className, ...props }, ref) => (<CommandPrimitive.List ref={ref} className={cx("command__list", className)} {...props}/>));
CommandList.displayName = CommandPrimitive.List.displayName;
const CommandEmpty = React.forwardRef((props, ref) => <CommandPrimitive.Empty ref={ref} className="command__empty" {...props}/>);
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;
const CommandGroup = React.forwardRef(({ className, ...props }, ref) => (<CommandPrimitive.Group ref={ref} className={cx("command__group", className)} {...props}/>));
CommandGroup.displayName = CommandPrimitive.Group.displayName;
const CommandItem = React.forwardRef(({ className, ...props }, ref) => (<CommandPrimitive.Item ref={ref} className={cx("command__item", className)} {...props}/>));
CommandItem.displayName = CommandPrimitive.Item.displayName;
export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem };
