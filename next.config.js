/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'maps.googleapis.com',
      'nlfzprhsotivtwemmxie.supabase.co',
      'lh5.googleusercontent.com',
      'lh3.googleusercontent.com',
      'lh4.googleusercontent.com',
      'lh6.googleusercontent.com',
      'streetviewpixels-pa.googleapis.com',
      'geo0.ggpht.com',
      'geo1.ggpht.com',
      'geo2.ggpht.com',
      'geo3.ggpht.com'
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'getblynt.com']
    }
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.csv$/,
      loader: 'csv-loader',
      options: {
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true
      }
    })
    return config
  }
}

module.exports = nextConfig