'use client';

import { CacheProvider } from '@chakra-ui/next-js'
import {ChakraProvider} from '@chakra-ui/react'
import theme from '@/theme/base';
import {SWRConfig} from 'swr';
import {fetcher} from '@/shared/utils/admin/SWRUtils';
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <html lang="en">
    <head><title>Meow 🐱</title></head>
    <body>
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <SWRConfig value={{fetcher: fetcher}}>
          {children}
        </SWRConfig>
      </ChakraProvider>
    </CacheProvider>
    </body>
    </html>
  )
}
