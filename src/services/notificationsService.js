import { notifications } from "@/lib/mock/activities";
export function getNotificationsSummary() {
    return {
        data: notifications.slice(0, 10).map((notification) => ({
            id: notification.id,
            title: notification.title,
            message: notification.message,
            read: notification.read,
            href: notification.href,
        })),
        meta: {
            unread: notifications.filter((notification) => !notification.read).length,
        },
    };
}
