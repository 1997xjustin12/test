"use client";
import { useState, useEffect } from "react";
import NextImage from "next/image";
import CardWrap from "@/app/components/admin/CardWrap";
import Button from "@/app/components/admin/Button";
const default_logo = "/Logo.webp";
const redisKey = "admin_solana_market_logo";

function LogoUpdater({ logo }) {
  const [currentLogo, setCurrentLogo] = useState(logo);
  const [logoInput, setLogoInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(null);
  const [alertToggle, setAlertToggle] = useState(false);

  const isValidImageUrl = (url) => {
    return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url);
  };

  const imageExists = (url, callback) => {
    const img = new Image();
    img.src = url;

    img.onload = () => callback(true); // Image loaded successfully
    img.onerror = () => callback(false); // Error loading image
  };

  
  const showAlertMessage = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertToggle(true);
    setTimeout(() => {
      setAlertToggle(false);
      setAlertType(null);
      setAlertMessage("");
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    console.log(value);
    setLogoInput(value);

    if (!isValidImageUrl(value)) {
      console.log("❌ Invalid image URL format");
      setInputError("❌ Invalid image URL format");
    } else {
      imageExists(value, (exists) => {
        if (exists) {
          console.log("✅ Image is valid and exists!");
          setInputError("");
        } else {
          console.log("❌ Image does not exist or is broken");
          setInputError("❌ Image does not exist or is broken");
        }
      });
    }
  };

  const getCurrentLogo = () => {
    fetch(`/api/redis?key=${redisKey}`)
      .then((res) => res.json())
      .then((data) => setCurrentLogo(data))
      .catch((err) => console.error("Error fetching Redis data:", err));
  };

  const clear = () => {
    getCurrentLogo();
    setLogoInput("");
  };

  const handleSaveLogo = async () => {
    setIsLoading(prev=> true);
    const response = await fetch("/api/redis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: redisKey, value: logoInput }),
    });

    const result = await response.json();
    if (result.success) {
      showAlertMessage("success", "Logo successfully updated, Please reload the market page.")
      clear();
      setIsLoading(prev=> false);
      // console.log("handleSaveLogoFNError: ", result);
    } else {
      showAlertMessage("error", "Action terminated, Logo not saved.")
      setIsLoading(prev=> false);
      // console.log("handleSaveLogoFNError: " + result);
    }
  };


  const handleUseDefaultLogo = async () => {
    const response = await fetch("/api/redis", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: redisKey }),
    });

    const result = await response.json();
    if (result.success) {
      showAlertMessage("success", "Successfully updated to default logo.")
      clear();
      // console.log('handleUseDefaultLogoFNSuccess', result);
    } else {
      showAlertMessage("error", "A problem occured setting the logo to default value.")
      // console.log("handleUseDefaultLogoFNError: " + result);
    }
  };

  return (
    <CardWrap>
      <div className="p-3">
        <div className="font-bold text-lg">Logo</div>
        <div className="text-sm">
          Update Logo Here or{" "}
          <span
            onClick={handleUseDefaultLogo}
            className="underline cursor-pointer text-blue-700 hover:text-blue-800"
          >
            Click here
          </span>{" "}
          to use default image.
        </div>
        <div className="flex mt-5 gap-[20px]">
          <div className="flex flex-col items-center font-semibold ">
            <div className="p-3 border rounded bg-stone-300">
              <div className="relative w-[200px] aspect-1">
                <NextImage src={default_logo} alt="" fill objectFit="contain" />
              </div>
            </div>
            Default Logo
          </div>
          <div className="flex flex-col items-center font-semibold ">
            <div className="p-3 border rounded bg-stone-300">
              <div className="relative w-[200px] aspect-1">
                <NextImage
                  src={currentLogo ?? default_logo}
                  alt=""
                  fill
                  objectFit="contain"
                />
              </div>
            </div>
            Current Logo
          </div>
          {inputError === "" && logoInput !== "" && (
            <div className="flex flex-col items-center font-semibold ">
              <div className="p-3 border rounded bg-stone-300">
                <div className="relative w-[200px] aspect-1">
                  <NextImage src={logoInput} alt="" fill objectFit="contain" />
                </div>
              </div>
              New Logo
            </div>
          )}
        </div>

        <div className="text-xs mt-4">
          For the best display quality, we recommend using a logo with
          dimensions of{" "}
          <span className="font-semibold">
            200x98 pixels (or a 2:1 aspect ratio)
          </span>
          . Ensure the image is clear and not stretched for optimal results.
        </div>
        <div className="mt-6">
          <label
            htmlFor="default-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Image URL:
          </label>
          <input
            type="text"
            id="default-input"
            value={logoInput}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <span
            className={`text-red-600 text-sm ${
              inputError === "" ? "opacity-0" : "opacity-100"
            }`}
          >
            {inputError}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between flex-col md:flex-row gap-[10px]">
          <Button
            disabled={!(inputError === "" && logoInput !== "")}
            onClick={handleSaveLogo}
            loading={isLoading}
          >
            Save
          </Button>
          <div
          className={`text-sm py-1 px-2 rounded border ${alertType === 'success' ? 'bg-green-200 text-green-800  border-green-400': 'bg-red-200 text-red-800  border-red-400' } ${alertToggle ? 'opacity-100':'opacity-0'}`}>
            {alertMessage}
          </div>
        </div>
      </div>
    </CardWrap>
  );
}

export default LogoUpdater;
