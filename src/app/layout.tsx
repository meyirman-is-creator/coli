import './globals.css'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'react-hot-toast'
import { ReduxProvider } from '@/store/provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'Coli - Сервис для поиска жилья и соседей',
  description: 'Найдите идеальный вариант проживания или подходящих соседей с помощью нашего сервиса',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${montserrat.variable} font-montserrat min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <Toaster position="top-right" />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}