import Image from 'next/image'
import Link from 'next/link'

const categories = [
  {
    title: 'Kawai',
    slug: 'kawai',
    image: '/images/portraits/kawai/-01.webp',
  },

  {
    title: 'Brooke',
    slug: 'brooke',
    image: '/images/portraits/brooke/-42.jpg',
  },
{
    title: 'Kendi',
    slug: 'kendi',
    image: '/images/portraits/kendi/thu.jpg',
  },
  {
    title: 'Slowtide',
    slug: 'slowtide',
    image: '/images/portraits/slowtide/(1).jpg',
  },
  {
    title: 'Newbury Park Prom 2024',
    slug: 'prom',
    image: '/images/portraits/prom/(2).jpg',
  },
  {
    title: 'Animals',
    slug: 'animals',
    image: '/images/portraits/animals/(17).jpg',
  },
 
//   {
//     title: '',
//     slug: '',
//     image: '/images/',
//   },
]

export default function PortraitDir() {
  return (
    <div id="top" className="container pt-4 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
        {categories.map((category) => (
          <Link key={category.slug} href={`/work/portraits/${category.slug}`} className="group">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="mt-4 font-light">{category.title}</p>
          </Link>
        ))}
      </div>
      <a
        href="#top"
        aria-label="Back to top"
        className="fixed bottom-4 right-4 z-[9999] flex h-12 w-12 items-center justify-center rounded-full border border-white/80 bg-black/90 text-lg font-semibold text-white shadow-xl backdrop-blur-sm lg:hidden"
      >
        Top
      </a>
      <p className="absolute mt-12 text-base font-thin pb-10 left-8">contact@benpowerphotography.com</p>
    </div>
  )
}