import { Request } from "express";

interface Notification {
  title?: string;
  body: string;
  class?: string;
}
export const setNotification = (
  req: Request,
  message: Notification,
  type?: string
) => {
  const notification = { ...message };

  switch (type) {
    case "danger":
      notification.class = "bg-danger";
      notification.title = "Oops!";
      break;

    default:
      notification.class = "bg-success";
      notification.title = "Yeay!";
      break;
  }
  req.flash("notification", JSON.stringify(notification));
};
export const getNotification = (req?: Request) => {
  if (!req) return {};

  const [notification = "{}"] = req.flash("notification");
  return JSON.parse(notification);
};
export const setFlash = (req: Request, key: string, value: any) => {
  const val = typeof value === "object" ? JSON.stringify(value) : value;
  req.flash(key, val);
};
export const getFlash = (req: Request, key: string) => {
  const [result = ""] = req.flash(key);
  try {
    return JSON.parse(result);
  } catch (error) {
    return result;
  }
};
