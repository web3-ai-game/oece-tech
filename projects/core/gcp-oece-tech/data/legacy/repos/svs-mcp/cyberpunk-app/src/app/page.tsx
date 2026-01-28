'use client'

import React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { Products } from '@/components/sections/Products'
import { UseCases } from '@/components/sections/UseCases'
import { CTA } from '@/components/sections/CTA'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Products />
      <UseCases />
      <CTA />
      <Footer />
    </div>
  )
}
