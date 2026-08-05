import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cx } from "@/lib/utils";
import "@/assets/styles/components/Tabs.scss";

const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => (<TabsPrimitive.List ref={ref} className={cx("tabs-list", className)} {...props}/>));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (<TabsPrimitive.Trigger ref={ref} className={cx("tabs-trigger", className)} {...props}/>));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => (<TabsPrimitive.Content ref={ref} className={cx("tabs-content", className)} {...props}/>));
TabsContent.displayName = TabsPrimitive.Content.displayName;
export { Tabs, TabsList, TabsTrigger, TabsContent };
