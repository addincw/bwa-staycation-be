import { Request, Response } from "express";
import ejs from "ejs";

import { parseViewContent, view } from "../../utils/template";
import { getErrorFields, setErrorField } from "../../utils/form";
import { toSlug } from "../../utils/string";

import Category from "../../models/master/Category";
import { getFlash, setFlash, setNotification } from "../../utils/flash";

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
    request: req,
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

  const olds = getFlash(req, "olds");
  const errs = getFlash(req, "errors");

  const fields = olds ? olds : category.toObject();
  const errors = errs ? errs : getErrorFields(fields);

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
export const store = async (req: Request, res: Response) => {
  const params = req.body;
  const { errors, fields } = _validate(params);

  // validate
  if (Object.keys(errors).length) {
    setNotification(req, { body: "Failed store new category" }, "danger");

    const scModal = JSON.stringify({
      type: "form",
      source: baseRoutePath + "/_form",
    });
    setFlash(req, "scModal:call", scModal);
    setFlash(req, "olds", JSON.stringify(fields));
    setFlash(req, "errors", JSON.stringify(errors));

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
    setNotification(req, { body: "Success store new category" });
  } catch (error) {
    setNotification(req, { body: "Failed store new category" }, "danger");
  }

  // handle success
  res.redirect(baseRoutePath);
};
export const showFormEdit = async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);

  const olds = getFlash(req, "olds");
  const errs = getFlash(req, "errors");

  const fields = olds ? olds : category.toObject();
  const errors = errs ? errs : getErrorFields(fields);

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
    setNotification(req, { body: "Failed update category" }, "danger");

    const scModal = JSON.stringify({
      type: "form",
      source: baseRoutePath + "/_form/" + fields.id,
    });
    setFlash(req, "scModal:call", scModal);
    setFlash(req, "olds", JSON.stringify(fields));
    setFlash(req, "errors", JSON.stringify(errors));

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
    setNotification(req, { body: "Success update category" });
  } catch (error) {
    setNotification(req, { body: "Failed update category" }, "danger");
  }

  // handle success
  res.redirect(baseRoutePath);
};
export const destroy = async (req: Request, res: Response) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    setNotification(req, { body: "Success delete category" });
  } catch (error) {
    setNotification(req, { body: "Failed delete category" }, "danger");
  }

  // handle success
  res.redirect(baseRoutePath);
};
