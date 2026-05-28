import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 pt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/work/concerts" className="group">
            <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src='/images/concerts/1.jpg'
              alt="Concert photography"
              layout="fill"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105 transform"
            />
            </div>
          <p className="mt-4 font-light">Concerts</p>
        </Link>
        <Link href="/work/portraits" className="group">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/portraits/2.jpg"
              alt="Portrait photography"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 brightness-125"
            />
          </div>
          <p className="mt-4 font-light">Portraits</p>
        </Link>
      </div>
      <p className="text-white opacity-0">
        Ben Power is a San Diego and LA photographer. His work primarily consists of concerts, portraiture, street photography, and cars. 
      </p>
      <p className="absolute mt-40 pb-4 text-base font-thin md:ml-4 md:left-8">contact@benpowerphotography.com</p>
      <Link href="/work">
        <p className="absolute pl-4 md:text-4xl md:mt-20 mt-20 right-20">See the rest of my portfolio in the work tab →</p>
      </Link>
    </div>
    
  )
}