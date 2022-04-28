import { Request, Response } from "express";
import ejs from "ejs";
import { getFlash, getNotification } from "./flash";

interface breadcrumb {
  name: string;
  href?: string;
  active: boolean;
}
interface viewParams {
  request: Request;
  response: Response;
  path: string;
  props?: viewProps;
  autoloadCssJs?: string;
}
interface viewProps {
  breadcrumbs?: Array<breadcrumb>;
  pageTitle?: string;
  [otherProps: string]: any;
}
interface viewContentParsed {
  additionalCSS?: string;
  additionalJS?: string;
  content: string;
  [otherProps: string]: any;
}

const _renderedBreadcrumbs = (breadcrumbs: Array<breadcrumb>): string => {
  const mappedBreadcrumbs = breadcrumbs.map((breadcrumb: breadcrumb) => {
    const cssClasses = ["breadcrumb-item"];
    if (breadcrumb.active) cssClasses.push("active");

    if (breadcrumb.href) {
      return `
        <li class="${cssClasses.join(" ")}">
            <a href="${breadcrumb.href}">${breadcrumb.name}</a>
        </li>
      `;
    }

    return `
        <li class="${cssClasses.join(" ")}">${breadcrumb.name}</li>
    `;
  });

  return `
    <ol class="breadcrumb float-sm-right">
        ${mappedBreadcrumbs.join("")}
    </ol>
  `;
};
const _parseViewContent = (
  content: string,
  autoloadCssJs?: string
): viewContentParsed => {
  const resultGroups: viewContentParsed = {
    additionalCSS: "",
    additionalJS: "",
    content,
  };

  if (autoloadCssJs) {
    const autoloadBasePath = "views/layouts/css-js/" + autoloadCssJs;
    ejs.renderFile(autoloadBasePath + "/style.ejs", [], (_, str) => {
      resultGroups.additionalCSS = str;
    });
    ejs.renderFile(autoloadBasePath + "/script.ejs", [], (_, str) => {
      resultGroups.additionalJS = str;
    });
  }

  const sections = content.match(/@scope_(.*)/g);
  sections?.forEach((sectionStart) => {
    const sectionName = sectionStart
      .replace(/@scope_(.*)/g, "$1")
      .toUpperCase();
    const sectionStartIndex = content.search(sectionStart);

    const sectionEnd = sectionStart.replace("@scope", "@endscope");
    const sectionEndIndex = content.search(sectionEnd);

    const sectionContent = content.substring(
      sectionStartIndex + sectionStart.length,
      sectionEndIndex
    );
    const contentToRemove = content.substring(
      sectionStartIndex,
      sectionEndIndex + sectionEnd.length
    );

    resultGroups["content"] = resultGroups.content.replace(contentToRemove, "");
    resultGroups["additional" + sectionName] += sectionContent;
  });

  return resultGroups;
};
export const bind = (req: Request, res: Response) => {
  const instance = {
    autoloadCssJs: "",
    addCssJs: (file: string) => {
      return { ...instance, autoloadCssJs: file };
    },
    view: function (path: string, props: any) {
      view({
        request: req,
        response: res,
        path,
        props,
        autoloadCssJs: this.autoloadCssJs,
      });
    },
  };

  return instance;
};
export const view = async ({
  request,
  response,
  path,
  props,
  autoloadCssJs,
}: viewParams) => {
  const content = await ejs.renderFile("views/" + path + ".ejs", { ...props });
  const parsedContent = _parseViewContent(content, autoloadCssJs);

  const breadcrumbs = _renderedBreadcrumbs(props?.breadcrumbs || []);
  const pageTitle = props?.pageTitle || "";
  const notification = getNotification(request);
  const scModalCall = getFlash(request, "scModal:call");

  response.render("layouts/index", {
    breadcrumbs,
    pageTitle,
    notification,
    scModalCall,
    ...parsedContent,
  });
};
export const viewStringify = async (path: string, props?: any) => {
  const view: string = await ejs.renderFile(path, props);
  const { content } = _parseViewContent(view);
  return content;
};
