/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    trailingSlash: true,
    images: {
        unoptimized: true, // بهینه‌سازی تصاویر غیرفعال می‌شود
      },
};

export default nextConfig;
