import Image from 'next/image';
import Link from 'next/link';
import categories from '../categories';

const HomeCategory = () => {
  return (
    <main className='w-full px-3'>
      <div id='categoryContainer' className='category-home-container w-full' style={{ backgroundColor: '#427664' }}>
        <section>
          <div className='flex flex-row justify-center w-full mx-0 mb-4'>
            <div className='flex-col'>
              <h5 className='text-white'>انتخاب دسته بندی</h5>
            </div>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 justify-center w-full mx-0'>
            {categories.map((category) => (
              <Link 
                href={`/menu#category-${category.id}`}
                className='text-white flex align-middle justify-center text-center w-auto'
                key={category.id}
              >
                <article className='flex justify-center align-middle mb-6'>
                  <div className='p-2 category-button' style={{ backgroundColor: '#ffffff1a', borderRadius: '1.3rem' }}>
                    <Image
                      className='category-button-image mb-2 mx-auto'
                      width={50}
                      height={50}
                      src={category.src}
                      alt={category.alt}
                    />
                    <p className='text-xs'>{category.label}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default HomeCategory;