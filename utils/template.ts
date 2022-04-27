import { Response } from "express";
import ejs from "ejs";

interface breadcrumb {
  name: string;
  href?: string;
  active: boolean;
}
interface viewParams {
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

const renderedBreadcrumbs = (breadcrumbs: Array<breadcrumb>): string => {
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
export const parseViewContent = (
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
export const view = async ({
  response,
  path,
  props,
  autoloadCssJs,
}: viewParams) => {
  const content = await ejs.renderFile("views/" + path + ".ejs", { ...props });
  const parsedContent = parseViewContent(content, autoloadCssJs);

  const breadcrumbs = renderedBreadcrumbs(props?.breadcrumbs || []);
  const pageTitle = props?.pageTitle || "";

  response.render("layouts/index", {
    breadcrumbs,
    pageTitle,
    ...parsedContent,
  });
};
