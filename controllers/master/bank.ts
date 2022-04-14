import { Request, Response } from "express";
import { view } from "../../utils/template";

const baseViewPath = "master/bank";
const baseBreadcrumbs = [
  { name: "Home", href: "/", active: false },
  { name: "Master Bank", active: true },
];

export const index = (req: Request, res: Response) => {
  view(res, baseViewPath + "/index", {
    breadcrumbs: baseBreadcrumbs,
    pageTitle: "Master Bank",
    contentTitle: "Master Bank Table",
  });
};
