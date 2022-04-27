export const toSlug = (text: String) => {
  const slug = text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[-]+/g, "-")
    .replace(/[^\w-]+/g, "");
  const uid = Math.floor(Math.random() * 101);

  return slug + "-" + uid;
};
