export function PaginationMeta({ 
  currentPage, 
  totalPages, 
  baseUrl 
}: { 
  currentPage: number; 
  totalPages: number; 
  baseUrl: string; 
}) {
  return (
    <>
      {currentPage > 1 && (
        <link 
          rel="prev" 
          href={`${baseUrl}${currentPage > 2 ? `?page=${currentPage - 1}` : ''}`}
        />
      )}
      {currentPage < totalPages && (
        <link 
          rel="next" 
          href={`${baseUrl}?page=${currentPage + 1}`}
        />
      )}
    </>
  )
} 