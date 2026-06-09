'use client'

import type { ReactNode } from 'react'

import NetworkProvider from './components/NetworkProvider'
import NetworkSwitch from './components/NetworkSwitch'

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <NetworkProvider>
      <div className="site-shell">
        <header className="topbar">
          <div className="nav-inner">
            <a href="/" className="brand" aria-label="ClawFarm home">ClawFarm</a>
            <div className="nav-tools">
              <nav className="nav-links" aria-label="Primary">
                <a href="/providers" className="nav-link">Providers</a>
                <a href="/builders" className="nav-link">Developers</a>
                <a href="/state" className="nav-link">State</a>
                <a href="/docs" className="nav-link">Docs</a>
                <a href="/whitepaper" className="nav-link">Whitepaper</a>
              </nav>
              <NetworkSwitch />
            </div>
          </div>
        </header>

        <div className="site-main">{children}</div>

        <footer className="site-footer">
          <div className="footer-inner">
            <div className="footer-row">
              <span className="footer-brand">ClawFarm</span>
              <div className="footer-right">
                <nav className="footer-links" aria-label="Footer">
                  <a href="/providers">Providers</a>
                  <span>.</span>
                  <a href="/builders">Developers</a>
                  <span>.</span>
                  <a href="/state">State</a>
                  <span>.</span>
                  <a href="/docs">Docs</a>
                  <span>.</span>
                  <a href="/whitepaper">Whitepaper</a>
                </nav>
                <p>Receipt settlement on Solana</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </NetworkProvider>
  )
}
