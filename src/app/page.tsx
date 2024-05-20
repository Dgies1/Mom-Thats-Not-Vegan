import Image from "next/image";
import {Chat} from "./components/chat";
export default function Home() {
  return (
    <main id="main" className="flex  min-h-screen md:h-screen flex-col lg:flex-row items-center justify-start md:justify-center mx-auto bg-[#e3e3e3]">

      <nav className="flex flex-row sm:flex-col md:my-5 items-center h-min">
        <Image src="/logo.png" alt="Logo" className="-rotate-12 sticker-shadow w-16 h-16 lg:w-auto lg:h-auto" width={512} height={512} loading="eager" />
        <h1 className="text-2xl sm:text-5xl drop-shadow-lg text-[#249a4b] sm:colorful-text font-bold">Mom, That&apos;s Not Vegan</h1>

      </nav>
      <div className="flex h-full w-full md:w-auto px-5 items-center md:px-0 py-6">
        <div className="card w-full p-0 md:p-8 md:w-96 h-full bg-[#e3e3e3]  shadow-2xl">
          
            <Chat />

        </div>

      </div>
    </main >
  );
}
