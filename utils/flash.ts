import { Request } from "express";

interface Notification {
  title?: String;
  body: String;
  class?: String;
}
export const setFlash = (
  req: Request,
  message: Notification,
  type?: String
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
export const getFlash = (req?: Request) => {
  if (!req) return {};

  const [notification = "{}"] = req.flash("notification");
  return JSON.parse(notification);
};
