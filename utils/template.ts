import { Response } from "express";
import ejs from "ejs";

interface breadcrumb {
  name: string;
  href?: string;
  active: boolean;
}

interface templateProps {
  breadcrumbs?: Array<breadcrumb>;
  pageTitle?: string;
  [otherProps: string]: any;
}

const groupBySections = (content: string): any => {
  const resultGroups: any = {
    additionalCSS: "",
    additionalJS: "",
    content,
  };
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
    resultGroups["additional" + sectionName] = sectionContent;
  });

  return resultGroups;
};
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

export const view = async (
  response: Response,
  path: string,
  props?: templateProps
) => {
  const content = await ejs.renderFile("views/" + path + ".ejs", { ...props });
  const grouppedContent = groupBySections(content);

  const breadcrumbs = renderedBreadcrumbs(props?.breadcrumbs || []);
  const pageTitle = props?.pageTitle || "";

  response.render("layouts/index", {
    breadcrumbs,
    pageTitle,
    ...grouppedContent,
  });
};
