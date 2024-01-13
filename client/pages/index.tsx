import { useState, Fragment } from "react";
import SearchIcon from "../components/icons/SearchIcon";
import StarIcon from "../components/icons/StarIcon";
import ChevronDownIcon from "../components/icons/ChevronDownIcon";
import ArrowDownIcon from "../components/icons/ArrowDownIcon";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import Link from "next/link";
import Image from "next/image";
import { truncateAddress } from "../util/truncateAddress";
import { Dialog, Transition } from "@headlessui/react";
import XMarkIcon from "../components/icons/XMarkIcon";

export default function TestPage() {
  const address = useAddress();
  console.log({ address });
  const [dropdown, setDropdown] = useState<"hidden" | "shown">("hidden");

  let [isOpen, setIsOpen] = useState(true);
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function scrollDown() {
    return window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  }

  return (
    <div className="">
      {/* Dialog */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="grid grid-cols-2 gap-4">
                    {/* left side */}
                    <div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/green_landscape_beautiful.png"
                        alt="trees"
                        className="w-full rounded-lg"
                      />

                      <div className="flex items-center justify-between mt-2">
                        <h3 className="text-xl font-medium leading-6 text-gray-900">
                          Title Title Title
                        </h3>
                        <p className="text-green-600 text-sm">available</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        {/* Image or artist */}
                        <div className="flex items-center gap-1 mt-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/images/girl_avatar.png"
                            className="w-6 h-6 rounded-full"
                            alt="avatar"
                          />
                          <p>Artist username</p>
                        </div>
                        <p className="text-lg font-bold">0.04 ETH</p>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Description (if the description longer then the “item
                          preview&apos;s frame” will also be longer)
                        </p>
                      </div>
                    </div>
                    {/* right side */}
                    <div>
                      <div className="flex justify-end">
                        <button
                          onClick={closeModal}
                          className="rounded-full bg-stone-100 hover:bg-stone-300 p-1"
                        >
                          <XMarkIcon />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <button className="bg-violet-200 text-violet-900 font-medium hover:bg-violet-300 px-8 py-2 rounded-md transition">
                          Buy
                        </button>
                        <button className="bg-teal-200 text-teal-900 font-medium hover:bg-teal-300 px-8 py-2 rounded-md transition">
                          Contact Artist
                        </button>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center gap-1">
                          <p>Rating 4.8/5.0</p>
                          <p className="text-yellow-500">
                            <StarIcon />
                          </p>
                        </div>
                        <p>0 Reviews</p>
                      </div>
                      <div className="mt-2">
                        <div className="italic text-sm text-slate-400">
                          No buyer yet
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

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
            {address ? (
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
                    <p className="text-xs">{truncateAddress(address)}</p>
                    <p className="text-xs">10.00 ETH</p>
                  </div>
                  <ChevronDownIcon />
                </div>
              </button>
            ) : (
              <div className="">
                <ConnectWallet theme="light" btnTitle="Connect Wallet" />
              </div>
            )}

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
          <h1 className="w-full flex text-center items-center justify-center text-[150px] leading-[1] gradient-text font-bold">
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

          <ul className=" grid grid-cols-2 gap-2 mt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((artist) => (
              <li
                key={artist}
                className="flex p-4 py-6 gap-2 items-center justify-between bg-stone-50 rounded-xl hover:bg-stone-100 transition"
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
                <div className="flex items-center">
                  <p>Overal Ratings 5.00</p>
                  <p className="text-yellow-500">
                    <StarIcon />
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Arts/Commision */}
        <section className="w-10/12 m-auto mt-20">
          <h4 className="text-6xl">Arts/Commision</h4>
          <div className="grid grid-cols-3 gap-10 mt-4 group">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((art) => (
              <article
                key={art}
                className="cursor-pointer rounded-lg transition hover:bg-slate-100"
                onClick={openModal}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/green_landscape_beautiful.png"
                  alt="trees"
                  className="w-full rounded-t-lg"
                />
                <div className="px-2 pb-2">
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
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer className="bg-slate-300 flex items-center justify-between px-10 py-4 mt-20">
        <p className="text-lg text-violet-900">&#174; 2024 PixelPal</p>
      </footer>
    </div>
  );
}
