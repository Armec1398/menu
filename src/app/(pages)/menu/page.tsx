"use client"
import React, { useMemo, useRef, useState } from 'react'
import brand from '@/app/components/brand'
import Image from 'next/image'
import Link from 'next/link'
import Slider from '@/app/components/menu/slider/slider'
import ProductList from '@/app/components/menu/product-list/productList'
import categories from '@/app/components/categories'  // Assuming this file exports categories
import { useEffect } from 'react';
import { Product } from '../../components/types';


export default function Menu() {
  const categoryRefs = useMemo(() => categories.map(() => React.createRef<HTMLDivElement>()), [categories]);

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    // بررسی وجود hash در URL
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        // ابتدا اسکرول نرم به عنصر مورد نظر
        element.scrollIntoView({ behavior: 'smooth' });

        // سپس 80 پیکسل پایین‌تر اسکرول کن
        window.setTimeout(() => {
          window.scrollBy({ top: -80, behavior: 'smooth' });
        }, 500); // با تاخیر برای اطمینان از اتمام اسکرول
      }
    }
  }, []);
  

  // تابع برای اضافه کردن به سبد خرید
  const handleAddToCart = (id: number) => {
    setSelectedProducts(prevProducts => 
      prevProducts.map(product =>
        product.id === id ? { ...product, count: product.count + 1 } : product
      )
    );
  };

  // تابع برای حذف از سبد خرید
  const handleRemoveFromCart = (id: number) => {
    setSelectedProducts(prevProducts => 
      prevProducts.map(product =>
        product.id === id && product.count > 0
          ? { ...product, count: product.count - 1 }
          : product
      )
    );
  };

  return (
    <>
      <section id='menu' className='w-full px-2 md:px-4 mx-auto'>
        <main className='primary-bg relative'>
          <div className="menu-logo text-center mb-6 flex justify-center">
            {brand.map((brand) => (
              <Image 
                src={brand.src}
                width={100}
                height={100}
                alt={brand.alt}
                key={brand.id}
              />
            ))}
          </div>

          <div className='mt-4 mb-6 flex justify-between relative'>
            <div id='dataTable_filter' className='dataTables_filter'>
              <label htmlFor="searchInput" className='w-full form-label mb-0 relative inline-block'>
                <input type="search" id="searchInput" className="form-control form-control-lg background-secondary secondary-border" aria-controls="dataTable" placeholder="جستجو ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <Image 
                  src="/images/search.png"
                  width={25}
                  height={25}
                  alt="جستجو"
                />
              </label>
            </div>

            <Link href="/" id='all-category' className='flex justify-center items-center px-2'>
              <Image 
                src="/images/category-svg.svg"
                width={40}
                height={40}
                alt="دسته بندی ها"
              />
              <span className='categories-text text-white'>دسته بندی ها</span>
            </Link>
          </div>

          {/* استفاده از categoryRefs در Slider */}
          <div className='category-slider-container mb-6'>
            <Slider categoryRefs={categoryRefs} />
          </div>

          {/* اضافه کردن refs به هر دسته بندی در ProductList */}
          <ProductList categoryRefs={categoryRefs} setSelectedProducts={setSelectedProducts} selectedProducts={selectedProducts} searchTerm={searchTerm}/>
        </main>
      </section>
    </>
  )
}
