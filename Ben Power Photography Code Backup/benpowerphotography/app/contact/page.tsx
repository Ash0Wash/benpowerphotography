import Image from 'next/image';

export default function Contact() {
  return (
    <div className="container max-w-7xl flex flex-col md:flex-row justify-center items-center mx-auto px-6 py-8">
      <div className="space-y-2 font-light mt-8 flex-1">
        <p>
          For inquiries about photography, collaborations, or print purchases, please reach out via email:
        </p>
        <p>
          <a href="mailto:contact@benpowerphotography.com" className="underline underline-offset-2">
            contact<span style={{ position: 'relative', top: '-2px' }}>@</span>benpowerphotography.com
          </a>
        </p>
        <p>
          Follow my work on{' '}
          <a 
            href="https://instagram.com/benpowerphoto" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            Instagram
          </a>
          {' '}to see what I am up to and behind-the-scenes content.
        </p>
        <form 
          action="https://formsubmit.co/contact@benpowerphotography.com" 
          method="POST" 
          className="space-y-4"
        >
          <div>
            <div className="mt-7">
              <label htmlFor="name" className="block space-y-2 font-light">
                Name
              </label>
            </div>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-700 focus:border-gray-700 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block space-y-2 font-light">
              Email
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-700 focus:border-gray-700 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="message" className="block space-y-2 font-light">
              Message
            </label>
            <textarea 
              id="message" 
              name="message" 
              rows={4} 
              required 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-700 focus:border-gray-700 sm:text-sm"
            ></textarea>
          </div>
          <div>
            <button 
              type="submit" 
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send
            </button>
          </div>
        </form>
      </div>
      <div className="mt-4 pt-6 md:mt-0 px-6 md:ml-4 w-full md:w-auto">
        <Image
          src={'/images/misc/womp.jpg'}
          className="w-full h-full object-contain"
          alt="shadow in the field"
          width={1024}
          height={768}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
    </div>
  )
}