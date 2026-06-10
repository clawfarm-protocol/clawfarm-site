import type { Metadata } from 'next'
import { IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google'

import ClientLayout from './client-layout'
import './globals.css'

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ClawFarm',
  description: 'The mining inference protocol for the AI economy.',
  url: 'https://clawfarm.network',
  logo: 'https://clawfarm.network/favicon.svg',
  potentialAction: {
    '@type': 'ViewAction',
    target: 'https://clawfarm.network/whitepaper',
    name: 'Read the ClawFarm whitepaper',
  },
}

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-sans',
  display: 'optional',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'optional',
})

export const metadata: Metadata = {
  title: 'ClawFarm — Mining inference',
  description: 'The mining inference protocol for the AI economy.',
  applicationName: 'ClawFarm',
  keywords: [
    'ClawFarm',
    'CLAF',
    'mining inference',
    'AI inference protocol',
    'permissionless AI',
    'Solana AI',
    'receipt settlement protocol',
    'AI inference mining',
  ],
  metadataBase: new URL('https://clawfarm.network'),
  openGraph: {
    title: 'ClawFarm — Mining inference',
    description: 'The settlement protocol for the inference economy.',
    type: 'website',
    url: 'https://clawfarm.network',
    siteName: 'ClawFarm',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ClawFarm — Mining inference',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClawFarm — Mining inference',
    description: 'A protocol for mining inference on Solana.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://clawfarm.network',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={`${ibmPlexSans.variable} ${jetBrainsMono.variable}`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
