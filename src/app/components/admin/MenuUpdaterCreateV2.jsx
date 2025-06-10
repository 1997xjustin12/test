"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { keys, redisSet, redisGet } from "@/app/lib/redis";
import { generateId } from "@/app/lib/helpers";

const menuListKey = keys.menu_list_shopify.value;
const activeMenuKey = keys.active_shopify_menu.value;

function MenuUpdaterCreate({ open, close, onUpdate }) {
  const [toggle, setToggle] = useState(false);
  const [menuList, setMenuList] = useState(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  const validateInput = (input) => {
    const regex = /^[a-zA-Z0-9-_ ]+$/; // Regex for alphanumeric, -, _, and spaces
    return regex.test(input);
  };

  const saveNewMenu = () => {
    const date = new Date();
    const newMenu = {
      key: `menu-${generateId()}`,
      name: name,
      date: date.toLocaleString(),
    };

    if (menuList) {
      redisSet(menuListKey, [...menuList, newMenu]).then((response) => {
        console.log("redisSetResponse", response);
        if (response.success) {
          setToggle(false);
          onUpdate();
        }
      });
    } else {
      redisSet(menuListKey, [newMenu]).then((response) => {
        console.log("redisSetResponse", response);
        if (response.success) {
          setToggle(false);
          onUpdate();
        }
      });
    }
  };

  const handleCloseModal = () => {
    setToggle(false);
    close(false);
  };

  const handleOpenModal = () => {
    setName("");
    setError("");
    setToggle(true);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setName(value);
    setError("");
  };

  const handleCreateConfirm = () => {
    redisGet(menuListKey).then((data) => {
      console.log("menu_list from UE", data);
      setMenuList(data);
    });
    // throw error regex validation
    if (!validateInput(name)) {
      setError("This is a regex error.");
      return;
    }

    if (
      menuList &&
      menuList.map((i) => i.name.toLowerCase()).includes(name.toLowerCase())
    ) {
      setError("This is a duplicate name error.");
      return;
    }

    saveNewMenu();
  };

  useEffect(() => {
    if (open) {
      redisGet(menuListKey).then((data) => {
        console.log("menu_list from UE", data);
        setMenuList(data);
        setToggle(true);
      });
    }
  }, [open]);

  return (
    <Dialog open={toggle} onClose={setToggle} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="w-screen h-screen relative">
          <div className="absolute inset-0  flex items-end justify-center md:p-4 text-center sm:items-center sm:p-[10px]">
            <DialogPanel
              transition
              className="w-full relative transform overflow-hidden bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-[500px] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 overflow-y-auto rounded-lg"
            >
              <div className="p-3">
                <div className="font-semibold">Create New Menu</div>
                <div className="text-sm">
                  Give a unique name for your new menu.
                </div>
                <div className="my-2">
                  <input
                    value={name}
                    onChange={handleInputChange}
                    type="text"
                    id="small-input"
                    placeholder="Menu Name"
                    className="rounded block w-full p-2 text-gray-900 border border-gray-300 bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  <span
                    className={`text-sm text-red-600 ${
                      error === "" ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    {error}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleCreateConfirm}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-3 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Confirm
                  </button>
                  <button onClick={handleCloseModal}>Cancel</button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default MenuUpdaterCreate;
