import React, { Suspense } from 'react'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { MeetingsViewError, MeetingsViewLoading, MeetingView } from '@/app/modules/meetings/ui/views/meetings-view'
import { getQueryClient, trpc } from '@/trpc/server'
import { ErrorBoundary } from 'react-error-boundary'

const page = () => {

  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(
    trpc.meetings.getMany.queryOptions({})
  )
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MeetingsViewLoading/>}>
          <ErrorBoundary fallback={<MeetingsViewError/>}>
        <MeetingView/>
        </ErrorBoundary>
        </Suspense>
    </HydrationBoundary>
  )
}

export default page


