import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import SearchModal from "./SearchModal";

export default function SearchBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  function openModal() {
    setModalKey((k) => k + 1);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (
        event.key !== "/" ||
        !(event.ctrlKey || event.metaKey) ||
        event.altKey
      ) {
        return;
      }
      event.preventDefault();
      openModal();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        className="search-trigger input input-bordered input-sm w-full mb-3 flex items-center gap-2 cursor-text"
        onClick={openModal}
      >
        <LuSearch size={14} className="text-base-content/50 shrink-0" />
        <span className="grow text-start text-sm text-base-content/40">
          جستجو...
        </span>
        <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold text-base-content/50 shrink-0">
          <kbd className="kbd kbd-xs bg-base-100 border-base-300">/</kbd>
          <kbd className="kbd kbd-xs bg-base-100 border-base-300">Ctrl</kbd>
        </span>
      </button>

      <SearchModal key={modalKey} isOpen={isOpen} onClose={closeModal} />
    </>
  );
}
