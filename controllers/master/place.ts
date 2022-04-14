import { Request, Response } from "express";
import { view } from "../../utils/template";

const baseViewPath = "master/place";
const baseBreadcrumbs = [
  { name: "Home", href: "/", active: false },
  { name: "Master Place", active: true },
];

export const index = (req: Request, res: Response) => {
  view(res, baseViewPath + "/index", {
    breadcrumbs: baseBreadcrumbs,
    pageTitle: "Master Place",
    contentTitle: "Master Place Table",
  });
};
