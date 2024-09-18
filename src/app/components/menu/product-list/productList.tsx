import Image from 'next/image';
import { useState, useRef, RefObject, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTimes } from '@fortawesome/free-solid-svg-icons';
import categories from '../../categories';
import productsData from '../../product';

import { Product } from '../../types';


interface ProductListProps {
  categoryRefs: React.RefObject<HTMLDivElement>[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  selectedProducts: Array<Product>;
  searchTerm: string;
}


export default function ProductList({ categoryRefs, setSelectedProducts,selectedProducts, searchTerm }: ProductListProps) {
  const [products, setProducts] = useState(productsData);
  const [popupImage, setPopupImage] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  
  
  // زمانی که modalIsOpen تغییر کند، به body کلاس no-scroll اضافه یا حذف می‌شود
  useEffect(() => {
    if (modalIsOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    // پاک کردن اثر زمانی که کامپوننت unmount شود
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [modalIsOpen]);

  const handleAddToCart = (productId: number) => {
    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product.id === productId) {
          const updatedProduct = { ...product, count: product.count + 1 };
          updateSelectedProducts(updatedProduct); // محصولات انتخابی را به‌روز کنید
          return updatedProduct;
        }
        return product;
      })
    );
  };

const handleRemoveFromCart = (productId: number) => {
  setProducts(prevProducts =>
    prevProducts.map(product => {
      if (product.id === productId && product.count > 0) {
        const updatedProduct = { ...product, count: product.count - 1 };
        updateSelectedProducts(updatedProduct); // محصولات انتخابی را به‌روز کنید
        return updatedProduct;
      }
      return product;
    })
  );
};

const updateSelectedProducts = (updatedProduct: Product) => {
  setSelectedProducts(prevSelected => {
    const exists = prevSelected.find(item => item.id === updatedProduct.id);
    if (updatedProduct.count > 0) {
      return exists
        ? prevSelected.map(item => (item.id === updatedProduct.id ? updatedProduct : item))
        : [...prevSelected, updatedProduct];
    } else {
      return prevSelected.filter(item => item.id !== updatedProduct.id);
    }
  });
};

  const openPopup = (src: string) => {
    setPopupImage(src);
  };

  const closePopup = () => {
    setPopupImage(null);
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // محاسبه مجموع قیمت محصولات انتخاب شده
  const calculateTotalPrice = () => {
    return selectedProducts.reduce((total, product) => total + product.price * product.count, 0);
  };

  // محاسبه مالیات
  const calculateTax = () => {
    return (calculateTotalPrice() * 0.09).toFixed(0); // مالیات 9% به تومان
  };

  // محاسبه قیمت کل
  const calculateTotalWithTax = () => {
    return calculateTotalPrice() + parseFloat(calculateTax());
  };

  // فرمت کردن قیمت به صورت سه رقم سه رقم
  const formatPrice = (price: number) => {
    const formattedPrice = price.toLocaleString('fa-IR');
    return formattedPrice;
  };

  // تابعی برای انتخاب واحد قیمت (هزار تومان یا میلیون تومان)
  const getPriceUnit = (price: number) => {
    if (price >= 1000) {
      return 'میلیون تومان';
    } else {
      return 'هزار تومان';
    }
  };

  return (
    <>
      {categories.map((category, index) => {
        const categoryProducts  = filteredProducts.filter(product => product.category === category.id);

        return categoryProducts.length > 0 ? (
          <section id={`category-${category.id}`} className='p-0' key={category.id} ref={categoryRefs[index]}>
            <div className='category-section py-3'>
              <div className="text-white text-center category-title">
                <p className="divider">
                  <span className="px-2">{category.label}</span>
                </p>
              </div>
              <div id='products-list'>
                <div className='product grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 px-0 sm:px-2 mb-3'>
                  {categoryProducts.map((product) => (
                    <article className='product-card px-2 pt-3 pb-1 mb-4 mx-2' key={product.id}>
                      <div className='w-full flex justify-start mb-5'>
                        <div className='flex justify-start product-img' onClick={() => openPopup(product.src)}>
                          <Image
                            src={product.src}
                            width={112}
                            height={128}
                            alt={product.title}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>
                        <div className='product-description flex flex-col justify-start items-start p-2 pb-0 w-full'>
                          <h6 className="text-white mb-3">{product.title}</h6>
                          <p className="text-secondary text-xs w-full">{product.description}</p>
                          <div className='w-full flex justify-between items-center'>
                            <h5 className="text-white mb-0">
                              <span className="price fa-number">{product.price}</span>
                              <span className="inline-block pr-1 text-xs">تومان</span>
                            </h5>
                            <div className="flex flex-row items-center">
                              {product.count === 0 ? (
                                <a
                                  className="add-cart secondary-bg text-dark pt-1 pb-0 px-3 rounded-md"
                                  role="button"
                                  onClick={() => handleAddToCart(product.id)}
                                >
                                  <FontAwesomeIcon icon={faPlus} />
                                </a>
                              ) : (
                                <div className="counter" style={{ display: "flex", alignItems: "center" }}>
                                  <button
                                    className="add-cart primary-bg text-white pt-1 pb-0 px-2 rounded-md"
                                    type="button"
                                    onClick={() => handleAddToCart(product.id)}
                                  >
                                    <FontAwesomeIcon icon={faPlus} />
                                  </button>
                                  <span className="count-product mx-1 sm:mx-3 text-white fw-bold fa-number">
                                    {product.count}
                                  </span>
                                  <button
                                    className="delete-cart primary-bg text-white pt-1 pb-0 px-2 rounded-md"
                                    type="button"
                                    onClick={() => handleRemoveFromCart(product.id)}
                                  >
                                    <FontAwesomeIcon icon={faMinus} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null;
      })}
      <div className='cart-main'>
        <div id="cart-button" className="cart-button flex items-center justify-center">
          <button className="secondary-bg px-2 rounded-md" type="button" onClick={() => setModalIsOpen(true)}>
            <Image src="/images/list.png" width={32} height={32} alt="سبد خرید" />
          </button>
          {selectedProducts.length > 0 && (
            <span className="badge bg-red-600 text-white fa-number">
              {selectedProducts.length}
            </span>
          )}
        </div>
        {modalIsOpen && (
          <div className="modal-overlay">
            <div className="modal m-2 sm:m-7 h-[100%]" id="cart" style={{ overflow: 'hidden' }}>
              <div className='modal-content h-[100%]'>
                <span className="close" onClick={() => setModalIsOpen(false)} style={{ cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={faTimes} />
                </span>
                <div className='modal-body p-0 relative h-[98%]'>
                  <div className='primary-bg text-center text-white h-[100%] px-1 sm:px-2 py-4 rounded-3xl relative border-[--divider] border-2'>
                    <p className="mb-6">یادداشت سفارش من</p>

                    {selectedProducts.length > 0 ? (
                      <div>
                        <div className="products-order">
                        {selectedProducts.map(product => (
                          <div key={product.id} className="product-card-selected flex justify-between items-center my-2">
                            {/* استایل مشابه product-card */}
                            <article className='product-card px-2 pt-3 pb-1 mb-4 mx-2' key={product.id}>
                              <div className='w-full flex justify-start mb-5'>
                                <div className='flex justify-start product-img'>
                                  <Image
                                    src={product.src}
                                    width={112}
                                    height={128}
                                    alt={product.title}
                                  />
                                </div>
                                <div className='product-description flex flex-col justify-start items-start p-2 pb-0 w-full'>
                                  <h6 className="text-white mb-3">{product.title}</h6>
                                  <div className='w-full flex justify-between items-center'>
                                    <h5 className="text-white mb-0">
                                      <span className="price fa-number">{product.price}</span>
                                      <span className="inline-block pr-1 text-xs">تومان</span>
                                    </h5>
                                    <div className="flex flex-row items-center">
                                      {product.count === 0 ? (
                                        <a
                                          className="add-cart secondary-bg text-dark pt-1 pb-0 px-3 rounded-md"
                                          role="button"
                                          onClick={() => handleAddToCart(product.id)}
                                        >
                                          <FontAwesomeIcon icon={faPlus} />
                                        </a>
                                      ) : (
                                        <div className="counter" style={{ display: "flex", alignItems: "center" }}>
                                          <button
                                            className="add-cart primary-bg text-white pt-1 pb-0 px-2 rounded-md"
                                            type="button"
                                            onClick={() => handleAddToCart(product.id)}
                                          >
                                            <FontAwesomeIcon icon={faPlus} />
                                          </button>
                                          <span className="count-product mx-1 sm:mx-3 text-white fw-bold fa-number">
                                            {product.count}
                                          </span>
                                          <button
                                            className="delete-cart primary-bg text-white pt-1 pb-0 px-2 rounded-md"
                                            type="button"
                                            onClick={() => handleRemoveFromCart(product.id)}
                                          >
                                            <FontAwesomeIcon icon={faMinus} />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </article>
                          </div>
                        ))}
                      </div>
                      {selectedProducts.length > 0 && (
                      <div className="price-container py-3">
                        <div className="flex justify-center items-start flex-col my-0 mx-auto text-right w-fit">
                          <div className="flex justify-between items-center w-full">
                            <span className="text-sm text-secondary pe-6">جمع:</span>
                            <p className="text-sm text-secondary mb-0">
                              <span className="sum-price text-sm text-secondary me-2 fa-number">{formatPrice(calculateTotalPrice())}</span>
                              <span className="text-sm text-secondary mb-0 price-span">{getPriceUnit(calculateTotalPrice())}</span>
                            </p>
                          </div>
                          <div className="flex justify-between items-center w-full mt-1 mb-2">
                            <span className="text-sm text-secondary pe-6">مالیات:</span>
                            <p className="text-sm text-secondary mb-0">
                              <span className="tax-price text-sm text-secondary me-2 fa-number">{formatPrice(parseFloat(calculateTax()))}</span>
                              <span className="text-sm text-secondary mb-0 price-span">{getPriceUnit(parseFloat(calculateTax()))}</span>
                            </p>
                          </div>
                          <div className="flex justify-between items-center w-full mb-2">
                            <span className="pe-6">مبلغ کل:</span>
                            <p className="mb-0">
                              <span className="total-price me-2 fa-number">{formatPrice(calculateTotalWithTax())}</span>
                              <span className="price-span">{getPriceUnit(calculateTotalWithTax())}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                      </div>
                    ) : (
                      <p className="no-items">هیچ آیتمی در یادداشت سفارش شما وجود ندارد.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {popupImage && (
        <div id="popup" className="popup-overlay" style={{ display: 'flex' }}>
          <div className="popup-content">
            <span className="close" onClick={closePopup} style={{ cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
            <Image
              src={popupImage}
              id="popup-image"
              width={640}
              height={512}
              alt="Popup Image"
              style={{ height: '100%', width: '100%' }}
            />
          </div>
        </div>
      )}
    </>
  );
}
