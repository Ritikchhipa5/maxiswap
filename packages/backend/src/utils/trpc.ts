import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '../server/routers/_app'

function getBaseUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return ''

    const ENV = process.env.VERCEL_URL || "https://ainzics.com"

  if (ENV)
    // reference for vercel.com
    return `https://${ENV}`

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      links: [
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           * */
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   * */
  ssr: true,
})

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      /**
       * If you want to use SSR, you need to use the server's full URL
       * @link https://trpc.io/docs/ssr
       * */
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
})

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
