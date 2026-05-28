import Image from 'next/image'

export default function About() {
  return (
    <div className="mx-auto p-4">
      <div className="flex flex-col md:flex-row content-center md:items-center">
        <div className="md:w-1/3">
          <Image
            src={'/images/misc/-47.jpg'}
            className="w-full h-full object-contain"
            alt="abandoned barn"
            width={600} 
            height={600} 
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
        <div className="ml-2 md:ml-12 pt-3 pr-2 relative text-left space-y-4 w-full md:w-1/3 text-2xl md:text-3xl font-thin">
          <p>
            Ben Power is a San Diego and LA photographer. His work primarily consists of concerts, portraiture, street photography, and cars. 
          </p>
        </div>
      </div>


      <div className="flex flex-col md:flex-row content-center md:items-center">
        <div className="m-2 md:ml-auto md:pl-60 pt-12 md:pt-1 text-left md:text-right pr-4 space-y-2 w-full md:w-1/2 font-thin text-2xl md:text-3xl">
          <p>
            His work has been featured in multiple art shows in Los Angeles, San Diego, and Ventura.
          </p>
        </div>
        <div className="mt-0 md:ml-4 pt-2 md:mr-4 md:pt-0 w-1 md:w-1/6 opacity-0  md:opacity-100">
          <Image
            src={'/images/misc/-59.jpg'}
            className="w-full h-full object-contain mt-4"
            alt="streetlight"
            width={600} 
            height={600} 
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      </div>
      <p className="mt-8 md:absolute md:mt-6 text-base font-thin left-8">contact@benpowerphotography.com</p>
    </div>
  )
}