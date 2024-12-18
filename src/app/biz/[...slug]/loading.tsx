export default function Loading() {
    return (
      <div className="animate-pulse">
        {/* Breadcrumbs skeleton */}
        <div className="container py-4">
          <div className="h-6 w-64 bg-muted rounded" />
        </div>
  
        {/* Header skeleton */}
        <div className="bg-white border-b">
          <div className="container py-8 space-y-4">
            <div className="h-8 w-96 bg-muted rounded" />
            <div className="h-6 w-72 bg-muted rounded" />
          </div>
        </div>
  
        {/* Main content skeleton */}
        <div className="container py-8">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Main content area */}
            <div className="lg:col-span-8 space-y-8">
              {/* Photos skeleton */}
              <div className="aspect-video bg-muted rounded-lg" />
              
              {/* Location skeleton */}
              <div className="h-[400px] bg-muted rounded-lg" />
            </div>
  
            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              {/* Contact info skeleton */}
              <div className="h-[200px] bg-muted rounded-lg" />
              
              {/* Related businesses skeleton */}
              <div className="h-[400px] bg-muted rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }