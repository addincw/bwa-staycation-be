import { Request, Response } from "express";
import { view } from "../../utils/template";

const baseViewPath = "master/category";
const baseBreadcrumbs = [
  { name: "Home", href: "/", active: false },
  { name: "Master Category", active: true },
];

export const index = (req: Request, res: Response) => {
  view(res, baseViewPath + "/index", {
    breadcrumbs: baseBreadcrumbs,
    pageTitle: "Master Category",
    contentTitle: "Master Category Table",
  });
};
