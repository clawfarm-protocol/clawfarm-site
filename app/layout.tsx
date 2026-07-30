import type { Metadata } from 'next'
import { IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google'

import ClientLayout from './client-layout'
import './globals.css'

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ClawFarm',
  description: 'AIRouter inference settlement through ClawFarm masterpool v3 on Solana Mainnet.',
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
  title: 'ClawFarm — Mainnet inference settlement',
  description: 'AIRouter inference settlement through ClawFarm masterpool v3 on Solana Mainnet.',
  applicationName: 'ClawFarm',
  keywords: [
    'ClawFarm',
    'CLAF',
    'AIRouter inference',
    'AI inference protocol',
    'permissionless AI',
    'Solana AI',
    'receipt settlement protocol',
    'AI inference settlement',
  ],
  metadataBase: new URL('https://clawfarm.network'),
  openGraph: {
    title: 'ClawFarm — Mainnet inference settlement',
    description: 'AIRouter inference settlement through ClawFarm masterpool v3 on Solana Mainnet.',
    type: 'website',
    url: 'https://clawfarm.network',
    siteName: 'ClawFarm',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ClawFarm — Mainnet inference settlement',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClawFarm — Mainnet inference settlement',
    description: 'AIRouter inference settlement through ClawFarm masterpool v3 on Solana Mainnet.',
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
