"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import brand from '../brand'

const HomeHeader=()=> {
  return (
    <>
        <header className='container pt-12 mx-auto flex justify-center z-10'>
          <div className='intro-text text-center fixed'>
            <div className='intro-heading text-uppercase mx-auto logo-home mb-12'>
            {brand.map((brand) => (
            <Image 
            src={brand.src}
            width={200}
            height={160}
            alt={brand.alt}
            key={brand.id}
            style={{ height: '100%', width: '100%' }}
            />
            ))}
            </div>
            <Link href="/menu" id="menu-button" className="secondary-bg text-black font-bold inline-block rounded-lg text-xl py-2 px-6" role='button'>
            <Image className='ms-1 inline-block'
            src="/images/main-menu.png"
            width={40}
            height={40}
            alt="menu-icon"
            />
            مشاهده منو
            </Link>
          </div>
        </header>
    </>
  )
}

export default HomeHeader
