import { cx } from "@/lib/utils";
import "@/assets/styles/components/Skeleton.scss";

function Skeleton({ className, ...props }) {
    return <div className={cx("skeleton", className)} {...props}/>;
}
export { Skeleton };
