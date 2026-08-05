"use client";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cx } from "@/lib/utils";
import "@/assets/styles/components/Dialog.scss";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (<DialogPrimitive.Overlay ref={ref} className={cx("dialog-overlay", className)} {...props}/>));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (<DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content ref={ref} className={cx("dialog-content", className)} {...props}>
      {children}
      <DialogPrimitive.Close className="dialog-close">
        <X className="dialog-close__icon"/>
        <span className="dialog-close__sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({ className, ...props }) => (<div className={cx("dialog-header", className)} {...props}/>);
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (<DialogPrimitive.Title ref={ref} className={cx("dialog-title", className)} {...props}/>));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogTitle };
