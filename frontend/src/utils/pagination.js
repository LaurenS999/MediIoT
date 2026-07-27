export function getPaginationItems(currentPage, totalPage) {
  const maxVisible = 5;

  let start = Math.max(currentPage - Math.floor(maxVisible / 2), 1);

  let end = start + maxVisible - 1;

  if (end > totalPage) {
    end = totalPage;
    start = Math.max(end - maxVisible + 1, 1);
  }

  const pages = [];

  // halaman pertama
  if (start > 1) {
    pages.push(1);
  }

  // ...
  if (start > 2) {
    pages.push("left-ellipsis");
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // ...
  if (end < totalPage - 1) {
    pages.push("right-ellipsis");
  }

  // halaman terakhir
  if (end < totalPage && !pages.includes(totalPage)) {
    pages.push(totalPage);
  }
  return pages;
}
