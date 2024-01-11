import { useState } from "react";
import SearchIcon from "../components/icons/SearchIcon";
import StarIcon from "../components/icons/StarIcon";
import ChevronDownIcon from "../components/icons/ChevronDownIcon";
import ArrowDownIcon from "../components/icons/ArrowDownIcon";
// bg-[#9A9CE9]
export default function TestPage() {
  const [dropdown, setDropdown] = useState<"hidden" | "shown">("hidden");

  function scrollDown() {
    return window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  }

  return (
    <div className="">
      <nav className="fixed z-10 bg-violet-400 w-screen h-[60px] px-4 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-10">
          <h4 className="text-xl">PixelPal</h4>

          {/* Input search bar */}
          <div className="border px-2 py-1 rounded-xl flex items-center gap-2 focus-within:ring-4 text-slate-600 border-slate-600">
            <SearchIcon />
            <input
              placeholder="Search art or artist"
              className="bg-transparent placeholder:text-slate-600 outline-none"
            />
          </div>
        </div>

        {/* Button collections */}
        <div className="flex flex-row items-center gap-4">
          <div className="relative">
            <button
              className="hover:bg-violet-500 px-3 py-1 rounded-lg transition"
              onClick={() =>
                setDropdown((p) => (p === "hidden" ? "shown" : "hidden"))
              }
            >
              <div className="flex items-center gap-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-10 h-10 rounded-full"
                  src="/images/girl_avatar.png"
                  alt="avatar"
                />
                <div>
                  <p className="text-xs">0x23.....28</p>
                  <p className="text-xs">10.00 ETH</p>
                </div>
                <ChevronDownIcon />
              </div>
            </button>

            {/* Dropdown */}
            <div
              className={`absolute w-60 right-0 top-12 bg-sky-300 rounded-lg p-4 ${
                dropdown === "shown" ? "block" : "hidden"
              } `}
            >
              <ul className="flex flex-col gap-1">
                <li className="active:scale-95 hover:bg-sky-400 transition px-4 py-2 rounded-lg">
                  Profile
                </li>
                <li className="active:scale-95 hover:bg-sky-400 transition px-4 py-2 rounded-lg">
                  Sell Arts
                </li>
                <li className="active:scale-95 hover:bg-sky-400 transition px-4 py-2 rounded-lg">
                  Orders
                </li>
                <li className="active:scale-95 hover:bg-sky-400 transition px-4 py-2 rounded-lg">
                  Settings
                </li>
                <li className="active:scale-95 hover:bg-sky-400 transition px-4 py-2 rounded-lg">
                  Logout
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <main className="bg-white pt-[60px]">
        {/* Main Header */}
        <section className="h-screen w-screen flex flex-col items-center justify-center">
          <h1 className="w-full flex text-center items-center justify-center text-[150px] leading-[1] gradient-text">
            Discover <br /> The World <br /> of Art
          </h1>
          <button
            onClick={scrollDown}
            className="mt-10 animate-bounce bg-slate-200 rounded-full flex items-center justify-center w-10 h-10"
          >
            <ArrowDownIcon className="text-slate-600" />
          </button>
        </section>

        {/* Top Artist */}
        <section className="w-10/12 m-auto">
          <h4 className="text-6xl">Artist</h4>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <ul className="bg-stone-300">
              {[1, 2, 3, 4].map((artist) => (
                <li
                  key={artist}
                  className="flex p-4 gap-2 items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="w-6 h-6 rounded-full"
                      src="/images/girl_avatar.png"
                      alt=""
                    />
                    <p>Artist Name</p>
                  </div>
                  <p>Overal Ratingsa 5.00</p>
                </li>
              ))}
            </ul>
            <div className="bg-stone-300">
              {[5, 6, 7, 8].map((artist) => (
                <li
                  key={artist}
                  className="flex p-4 gap-2 items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="w-6 h-6 rounded-full"
                      src="/images/girl_avatar.png"
                      alt=""
                    />
                    <p>Artist Name</p>
                  </div>
                  <p>Overal Ratingsa 5.00</p>
                </li>
              ))}
            </div>
          </div>
        </section>

        {/* Arts/Commision */}
        <section className="w-10/12 m-auto mt-20">
          <h4 className="text-6xl">Arts/Commision</h4>
          <div className="grid grid-cols-3 gap-10 mt-4">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((art) => (
              <div key={art} className="rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/green_landscape_beautiful.png"
                  alt="trees"
                  className="w-full rounded-t-lg"
                />
                <p className="text-xl mt-2">Genshin Commision Art</p>
                <div className="flex items-center gap-1 mt-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/girl_avatar.png"
                    className="w-6 h-6 rounded-full"
                    alt="avatar"
                  />
                  <p>Artist username</p>
                </div>
                <div className="flex justify-between mt-1">
                  <div className="flex gap-6 items-center">
                    <p className="text-slate-500 text-sm">150 reviews</p>
                    <div className="flex items-center">
                      <p className="text-yellow-500">
                        <StarIcon />
                      </p>
                      &nbsp;
                      <p>4.8</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold">0.04 ETH</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="bg-slate-300 flex items-center justify-between px-10 py-4 mt-20">
        <p className="text-lg text-violet-900">&#174; 2024 PixelPal</p>
        <div className="text-sm">
          <p>Contact Us: N/A</p>
        </div>
      </footer>
    </div>
  );
}
