
const Loading = () => {
  return (
    
    <main className="mx-auto min-h-screen w-full max-w-7xl animate-pulse px-4 pt-8 pb-16 sm:px-6 lg:px-8">
      {/* Breadcrumb & Action Buttons Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 rounded-sm bg-slate-200" />
          <div className="h-3 w-3 rounded-full bg-slate-200" />
          <div className="h-4 w-20 rounded-sm bg-slate-200" />
          <div className="h-3 w-3 rounded-full bg-slate-200" />
          <div className="h-4 w-32 rounded-sm bg-slate-200" />
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <div className="h-8 flex-1 rounded-md bg-slate-200 sm:w-20 sm:flex-initial" />
          <div className="h-8 flex-1 rounded-md bg-slate-200 sm:w-20 sm:flex-initial" />
        </div>
      </div>

      {/* Hero Banner Image Skeleton */}
      <div className="mt-6 h-50 md:h-80 lg:h-120 w-full rounded-xs bg-slate-200" />

      {/* Main Content & Sidebar Grid Skeleton */}
      <div className="mt-8 border-t border-slate-100 pt-8 lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-8">
          {/* Location Badge */}
          <div className="h-4 w-28 rounded-sm bg-slate-200" />

          {/* Title */}
          <div className="mt-3 h-9 w-3/4 rounded-sm bg-slate-200 sm:h-11 sm:w-1/2" />

          {/* Rating & Duration */}
          <div className="mt-4 flex items-center gap-4">
            <div className="h-4 w-28 rounded-sm bg-slate-200" />
            <div className="h-4 w-24 rounded-sm bg-slate-200" />
          </div>

          {/* Overview Section */}
          <div className="mt-8 space-y-3">
            <div className="h-6 w-32 rounded-sm bg-slate-200" />
            <div className="h-4 w-full rounded-sm bg-slate-200" />
            <div className="h-4 w-11/12 rounded-sm bg-slate-200" />
            <div className="h-4 w-4/5 rounded-sm bg-slate-200" />
          </div>

          {/* Highlights Section */}
          <div className="mt-8 space-y-3">
            <div className="h-6 w-32 rounded-sm bg-slate-200" />
            <div className="h-4 w-full rounded-sm bg-slate-200" />
            <div className="h-4 w-3/4 rounded-sm bg-slate-200" />

            <div className="mt-5 grid grid-cols-1 gap-y-3 gap-x-6 sm:grid-cols-2">
              <div className="h-4 w-4/5 rounded-sm bg-slate-200" />
              <div className="h-4 w-3/4 rounded-sm bg-slate-200" />
              <div className="h-4 w-5/6 rounded-sm bg-slate-200" />
              <div className="h-4 w-2/3 rounded-sm bg-slate-200" />
              <div className="h-4 w-3/5 rounded-sm bg-slate-200" />
            </div>
          </div>
        </div>

        {/* Right Column (Booking Card) Skeleton */}
        <div className="mt-10 lg:mt-0 lg:col-span-4">
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-xs">
            <div className="h-3 w-20 rounded-sm bg-slate-200" />
            <div className="mt-2 h-9 w-32 rounded-sm bg-slate-200" />
            <div className="mt-1 h-3 w-16 rounded-sm bg-slate-200" />

            <div className="mt-6 h-11 w-full rounded-md bg-slate-200" />
            <div className="mt-4 h-11 w-full rounded-md bg-slate-200" />

            <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
              <div className="h-3 w-4/5 rounded-sm bg-slate-200" />
              <div className="h-3 w-3/4 rounded-sm bg-slate-200" />
              <div className="h-3 w-2/3 rounded-sm bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Loading