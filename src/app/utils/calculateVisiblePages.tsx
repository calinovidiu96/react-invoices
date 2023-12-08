export const calculateVisiblePages = (
  currentPage: number,
  totalPages: number
) => {
  const maxVisiblePages = 5 // You can adjust this number as needed
  const halfVisiblePages = Math.floor(maxVisiblePages / 2)

  let startPage = currentPage - halfVisiblePages
  let endPage = currentPage + halfVisiblePages

  if (startPage < 1) {
    startPage = 1
    endPage = Math.min(totalPages, maxVisiblePages)
  }

  if (endPage > totalPages) {
    endPage = totalPages
    startPage = Math.max(1, totalPages - maxVisiblePages + 1)
  }

  return Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  )
}
