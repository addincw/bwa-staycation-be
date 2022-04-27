import { Request, Response } from "express";
import ejs from "ejs";

import { parseViewContent, view } from "../../utils/template";
import { getErrorFields, setErrorField } from "../../utils/form";
import { toSlug } from "../../utils/string";

import Category from "../../models/master/Category";

const baseRoutePath = "/master/category";
const baseViewPath = "master/category";
const baseBreadcrumbs = [
  { name: "Home", href: "/", active: false },
  { name: "Master Category", active: true },
];

const _validate = (params: any) => {
  let errors: any = {};

  // validation fields
  if (!params.name) {
    errors["name"] = setErrorField(errors.name, "Field name is required");
  }

  return {
    errors,
    fields: params,
  };
};

export const index = async (req: Request, res: Response) => {
  const categories = await Category.find();

  view({
    response: res,
    path: baseViewPath + "/index",
    props: {
      breadcrumbs: baseBreadcrumbs,
      pageTitle: "Master Category",
      categories,
    },
    autoloadCssJs: "datatable",
  });
};
export const showFormCreate = async (req: Request, res: Response) => {
  const category = new Category();
  const fields = category.toObject();
  const errors = getErrorFields(fields);

  const view = await ejs.renderFile("views/" + baseViewPath + "/_form.ejs", {
    action: baseRoutePath,
    fields,
    errors,
  });
  const parsedView = parseViewContent(view);

  res.status(200).json({
    title: "New Category",
    body: parsedView.content,
    additionalCSS: parsedView.additionalCSS,
    additionalJS: parsedView.additionalJS,
  });
};
// TODO: handle old value if validation error
export const store = async (req: Request, res: Response) => {
  const params = req.body;
  const { errors, fields } = _validate(params);

  // validate
  if (Object.keys(errors).length) {
    res.redirect(baseRoutePath);
    return;
  }

  // store
  const name = fields.name;
  const slug = toSlug(name);
  const is_active = fields?.is_active === "true";
  const is_highlight = fields?.is_highlight === "true";

  const category = new Category({
    name,
    slug,
    is_active,
    is_highlight,
  });

  try {
    await category.save();
  } catch (error) {}

  // handle success
  res.redirect(baseRoutePath);
};
export const showFormEdit = async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);
  const fields = category.toObject();
  const errors = getErrorFields(fields);

  const view = await ejs.renderFile("views/" + baseViewPath + "/_form.ejs", {
    action: baseRoutePath + "?_method=PUT",
    fields,
    errors,
  });
  const parsedView = parseViewContent(view);

  res.status(200).json({
    title: "Edit Category",
    body: parsedView.content,
    additionalCSS: parsedView.additionalCSS,
    additionalJS: parsedView.additionalJS,
  });
};
export const update = async (req: Request, res: Response) => {
  const params = req.body;
  const { errors, fields } = _validate(params);

  // validate
  if (Object.keys(errors).length) {
    res.redirect(baseRoutePath);
    return;
  }

  // store
  const name = fields.name;
  const slug = toSlug(name);
  const is_active = fields?.is_active === "true";
  const is_highlight = fields?.is_highlight === "true";

  try {
    await Category.findOneAndUpdate(
      { _id: fields.id },
      {
        name,
        slug,
        is_active,
        is_highlight,
      }
    );
  } catch (error) {}

  // handle success
  res.redirect(baseRoutePath);
};
export const destroy = async (req: Request, res: Response) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
  } catch (error) {}

  // handle success
  res.redirect(baseRoutePath);
};
