import { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import 'swiper/css';
import categories from '../../categories';

interface SliderProps {
    categoryRefs: React.RefObject<HTMLDivElement>[];
  }
  
  const Slider: React.FC<SliderProps> = ({ categoryRefs }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const swiperRef = useRef<any>(null);
    // const prevScrollPos = useRef<number>(0);

    
    useEffect(() => {
        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = categoryRefs.findIndex(ref => ref.current === entry.target);
                    setActiveIndex(index); // Update active slide index based on visible section
                    if (swiperRef.current) {
                        swiperRef.current.slideTo(index); // Sync Swiper to match the current category section
                    }
                }
            });
        };

        const observerOptions = {
            root: null, // Use the viewport as the container
            threshold: 1 // Trigger when at least 50% of the category section is visible
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe each category section
        categoryRefs.forEach(ref => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        return () => {
            // Clean up observer when component unmounts
            categoryRefs.forEach(ref => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            });
        };
    }, [categoryRefs]);

    const handleSlideClick = (index: number) => {
        setActiveIndex(index);
        if (swiperRef.current) {
            swiperRef.current.slideTo(index);
        }
        const targetElement = categoryRefs[index].current;
        if (targetElement) {
            const offsetPosition = targetElement.offsetTop - 80;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <>
            <Swiper
                className='mySwiper px-4'
                spaceBetween={5}
                slidesPerView={2}
                centeredSlides={true}
                direction='horizontal'
                onSwiper={(swiper) => swiperRef.current = swiper}
                breakpoints={{
                    1290: {
                        slidesPerView: 8,
                        spaceBetween: 20
                    },
                    1024: {
                        slidesPerView: 6,
                        spaceBetween: 20
                    },
                    840: {
                        slidesPerView: 5,
                        spaceBetween: 20
                    },
                    600: {
                        slidesPerView: 3,
                        spaceBetween: 20
                    },
                    480: {
                        slidesPerView: 3,
                        spaceBetween: 10
                    },
                    335: {
                        slidesPerView: 2,
                        spaceBetween: 10
                    },
                }}
            >
                {categories.map((category, index: number) => (
                    <SwiperSlide
                        className={`py-2 text-white ${activeIndex === index ? 'active' : ''}`}
                        key={index}
                        onClick={() => handleSlideClick(index)}
                    >
                        <div className={`category-button p-2 gap-4 ${activeIndex === index ? 'active' : ''}`}>
                            <Image
                                className='category-button-image mx-auto'
                                width={50}
                                height={50}
                                src={category.src}
                                alt={category.alt}
                            />
                            <p className="text-xs category-button-p mb-0">{category.label}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
};

export default Slider;
