import * as React from "react";
import { cx } from "@/lib/utils";
import "./Card.scss";

const Card = React.forwardRef(({ className, ...props }, ref) => (<div ref={ref} className={cx("card", className)} {...props}/>));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (<div ref={ref} className={cx("card__header", className)} {...props}/>));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (<div ref={ref} className={cx("card__title", className)} {...props}/>));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (<div ref={ref} className={cx("card__description", className)} {...props}/>));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => (<div ref={ref} className={cx("card__content", className)} {...props}/>));
CardContent.displayName = "CardContent";
export { Card, CardHeader, CardTitle, CardDescription, CardContent };
export default Card;
