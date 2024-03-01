"use client";
import Image from "next/image";
import "flag-icon-css/css/flag-icons.min.css";
import LoaderWithFacts from "../../components/LoaderWithFacts";
import ContactForm from "../../components/ContactForm";
import { getCountries } from "country-state-picker";
import { CountryData } from "country-codes-list";
import { getAllCurrencies } from "../../components/currencyAPI";
import ReactFlagsSelect from "react-flags-select";
import ReactCountryFlag from "react-country-flag";
import getSymbolFromCurrency from "currency-symbol-map";
import { Country } from "country-state-city";

import "./globals.css";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputText, setInputText] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const [isContactPopupVisible, setContactPopupVisibility] = useState(false);
  const [consultationNeeded, setConsultationNeeded] = useState(true);
  const [currencies, setCurrencies] = useState([]);
  const [selected, setSelected] = useState("");
  const [selectedValuesFilters, setSelectedValuesFilters] = useState({
    country: "option1",
    currency: "option1",
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleSelectOption = (countryCode) => {
    handleCountryChange(countryCode);
    setIsOpen(false);
  };
  // const [selectedValuesPOS, setSelectedValuesPOS] = useState({
  //   country: 'option1',
  //   currency: 'option1'
  // });

  const handleConsultationChange = (event) => {
    const { checked } = event.target;
    setConsultationNeeded(checked);

    // Store the value in session storage
    sessionStorage.setItem("consultationNeeded", checked ? "yes" : "no");
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const currenciesData = await getAllCurrencies();
        setCurrencies(currenciesData);
        const currenciesArray = Object.values(currenciesData);
        setCurrencies(currenciesArray);
        console.log(currenciesData);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };
    fetchCurrencies();

    sessionStorage.setItem("product", "payment gateway");

    sessionStorage.setItem("consultationNeeded", "yes");
    const handleClickOutside = (event) => {
      // Close the dropdown if the click is outside of it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    // Add click event listener to the document body
    document.body.addEventListener("click", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      sessionStorage.clear();
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleOpenPopup = () => {
    setPopupVisibility(true);
  };

  const handleClosePopup = () => {
    const checkedVar = sessionStorage.getItem("consultationNeeded");
    if (checkedVar === "yes") {
      setPopupVisibility(false);
      setContactPopupVisibility(true);
      setResponseText("");
    } else if (checkedVar === "no") {
      setPopupVisibility(false);
      setResponseText("");
    }
  };

  const handleOpenContactPopup = () => {
    setContactPopupVisibility(true);
  };

  const handleCloseContactPopup = () => {
    setContactPopupVisibility(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    setResponseText("");
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
    sessionStorage.setItem("product", option);
  };

  const handleCountryChange = (event) => {
    const { value } = event.target;
    console.log("Selected country:", value);
    setSelectedValuesFilters((prevValues) => ({
      ...prevValues,
      country: value,
    }));
    sessionStorage.setItem("country", value);
  };

  // const handleCountryChange = (countryCode) => {
  //   console.log("Selected country code:", countryCode);
  //   setSelectedValuesFilters((prevValues) => ({
  //     ...prevValues,
  //     country: countryCode,
  //   }));
  //   sessionStorage.setItem("country", countryCode);
  // };

  const handleCurrencyChange = (event) => {
    // const selectedValue = event.target.value;
    const { value } = event.target;
    setSelectedValuesFilters((prevValues) => ({
      ...prevValues,
      currency: value,
    }));
    sessionStorage.setItem("currency", value);
  };

  const handleButtonClick = async () => {
    try {
      setIsLoading(true);
      let product;
      if (
        sessionStorage.getItem("product").toLowerCase() === "payment gateway"
      ) {
        product = "payment gateway";
      } else if (sessionStorage.getItem("product").toLowerCase() === "pos") {
        product = "pos";
      }

      const country = sessionStorage.getItem("country");
      const currency = sessionStorage.getItem("currency");

      const response = await fetch(
        `https://uxgey6rgmldnpumnikzsihhagq0uqxpa.lambda-url.us-east-1.on.aws/?product=${product}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: inputText,
            country: country,
            currency: currency,
          }),
        }
      );

      if (!response.ok) {
        console.log("error receiving response");
        throw new Error("Failed to fetch data");
      }

      const responseData = await response.json();
      const botResponse = responseData.bot.trim();
      setIsLoading(false);
      console.log(botResponse);

      setResponseText(botResponse);
      handleOpenPopup();

      setIsLoading(false);

      // setResponseText(botResponse);
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error.message);
    }
  };

  const isButtonDisabled =
    (inputText === null &&
      selectedValuesFilters.country === "option1" &&
      selectedValuesFilters.currency === "option1") ||
    isLoading ||
    responseText.trim() !== "";

  const countries = getCountries().map((country) => ({
    name: country.name,
    code: country.code.toLowerCase(),
  }));

  let currencySymbol = "";
  const countryDetails = Country.getCountryByCode(
    selectedValuesFilters.country
  );

  if (countryDetails && countryDetails.currency) {
    currencySymbol = getSymbolFromCurrency(countryDetails.currency);
  }

  return (
    <body>
      <main className="flex flex-col min-h-screen items-center justify-center p-8 sm:p-16 md:p-24 lg:p-32 xl:p-40">
        <div className="flex flex-col items-start justify-center w-full max-w-96 border-2 border-gray-200 rounded-xl p-4">
          <label
            htmlFor="menu-button"
            className="text-black font-semibold mb-1 text-sm mt-4"
          >
            Select your product
          </label>
          <div className="flex justify-between w-full mb-4">
            <div className="flex justify-between w-full">
              <div className="w-1/2 mr-2 flex items-center">
                <button
                  type="button"
                  className={`inline-flex justify-center items-center h-10 w-full mt-1 rounded-md text-sm shadow-sm bg-white ${
                    selectedOption === "Payment Gateway"
                      ? "ring-1 ring-indigo-500 text-indigo-500"
                      : " text-gray-400"
                  }`}
                  onClick={() => handleOptionClick("Payment Gateway")}
                >
                  <div className="flex items-center gap-2">
                    <svg
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill={
                        selectedOption === "Payment Gateway" ? "blue" : "gray"
                      }
                      fillOpacity={
                        selectedOption === "Payment Gateway" ? "0.6" : "0.6"
                      }
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.5 0.25C8.57164 0.25 6.68657 0.821828 5.08319 1.89317C3.47982 2.96451 2.23013 4.48726 1.49218 6.26884C0.754225 8.05042 0.561142 10.0108 0.937348 11.9021C1.31355 13.7934 2.24215 15.5307 3.60571 16.8943C4.96928 18.2579 6.70656 19.1865 8.59787 19.5627C10.4892 19.9389 12.4496 19.7458 14.2312 19.0078C16.0127 18.2699 17.5355 17.0202 18.6068 15.4168C19.6782 13.8134 20.25 11.9284 20.25 10C20.2473 7.41498 19.2192 4.93661 17.3913 3.10872C15.5634 1.28084 13.085 0.25273 10.5 0.25ZM10.5 18.25C8.86831 18.25 7.27326 17.7661 5.91655 16.8596C4.55984 15.9531 3.50242 14.6646 2.878 13.1571C2.25358 11.6496 2.0902 9.99085 2.40853 8.3905C2.72685 6.79016 3.51259 5.32015 4.66637 4.16637C5.82016 3.01259 7.29017 2.22685 8.89051 1.90852C10.4909 1.59019 12.1497 1.75357 13.6571 2.37799C15.1646 3.00242 16.4531 4.05984 17.3596 5.41655C18.2661 6.77325 18.75 8.3683 18.75 10C18.7475 12.1873 17.8775 14.2843 16.3309 15.8309C14.7843 17.3775 12.6873 18.2475 10.5 18.25ZM7.60032 7.39937C8.02416 8.2007 8.24573 9.09348 8.24573 10C8.24573 10.9065 8.02416 11.7993 7.60032 12.6006C7.55549 12.6898 7.49332 12.7691 7.41744 12.8339C7.34157 12.8988 7.25352 12.9478 7.15845 12.9782C7.06338 13.0085 6.96321 13.0196 6.8638 13.0108C6.76439 13.002 6.66775 12.9734 6.57953 12.9267C6.49132 12.88 6.4133 12.8162 6.35006 12.739C6.28681 12.6618 6.23961 12.5728 6.21122 12.4771C6.18283 12.3814 6.17382 12.281 6.18472 12.1818C6.19562 12.0826 6.22621 11.9866 6.27469 11.8994C6.58856 11.3155 6.75284 10.6629 6.75284 10C6.75284 9.33709 6.58856 8.68452 6.27469 8.10063C6.18655 7.92531 6.17063 7.72244 6.23034 7.53553C6.29005 7.34861 6.42063 7.19254 6.59407 7.10079C6.76752 7.00903 6.97002 6.98891 7.15813 7.04473C7.34624 7.10055 7.50499 7.22787 7.60032 7.39937ZM12.8503 4.39937C13.7728 6.12305 14.2555 8.04781 14.2555 10.0028C14.2555 11.9578 13.7728 13.8826 12.8503 15.6063C12.7505 15.7702 12.5915 15.8896 12.4063 15.9399C12.221 15.9902 12.0235 15.9676 11.8544 15.8766C11.6854 15.7856 11.5576 15.6333 11.4975 15.451C11.4374 15.2687 11.4495 15.0702 11.5313 14.8966C12.3379 13.3905 12.76 11.7085 12.76 10C12.76 8.29151 12.3379 6.60949 11.5313 5.10344C11.4375 4.9279 11.4174 4.72231 11.4752 4.5319C11.533 4.34149 11.6642 4.18186 11.8397 4.08813C12.0152 3.99439 12.2208 3.97422 12.4112 4.03207C12.6016 4.08991 12.7613 4.22102 12.855 4.39656L12.8503 4.39937ZM10.2253 5.89937C10.8986 7.162 11.2508 8.57094 11.2508 10.0019C11.2508 11.4328 10.8986 12.8417 10.2253 14.1044C10.18 14.1931 10.1175 14.2718 10.0415 14.3361C9.96541 14.4004 9.87732 14.4488 9.78233 14.4787C9.68734 14.5086 9.58736 14.5192 9.48821 14.51C9.38906 14.5008 9.29273 14.472 9.20485 14.4252C9.11696 14.3784 9.03928 14.3145 8.97632 14.2374C8.91337 14.1603 8.8664 14.0713 8.83817 13.9759C8.80994 13.8804 8.80101 13.7802 8.81189 13.6812C8.82278 13.5823 8.85326 13.4864 8.90157 13.3994C9.45931 12.3538 9.75107 11.1869 9.75107 10.0019C9.75107 8.81681 9.45931 7.64998 8.90157 6.60437C8.85326 6.5173 8.82278 6.42149 8.81189 6.32251C8.80101 6.22353 8.80994 6.12338 8.83817 6.02789C8.8664 5.9324 8.91337 5.84349 8.97632 5.76635C9.03928 5.6892 9.11696 5.62536 9.20485 5.57856C9.29273 5.53175 9.38906 5.50291 9.48821 5.49373C9.58736 5.48454 9.68734 5.49519 9.78233 5.52505C9.87732 5.55492 9.96541 5.6034 10.0415 5.66766C10.1175 5.73193 10.18 5.8107 10.2253 5.89937Z" />
                    </svg>
                    <p
                      className={
                        selectedOption === "Payment Gateway"
                          ? "text-indigo-500"
                          : "text-gray-400"
                      }
                    >
                      Payment gateway
                    </p>
                  </div>
                </button>
              </div>

              <div className="w-1/2 ml-2 flex items-center">
                <button
                  type="button"
                  className={`inline-flex justify-center items-center h-10 w-full mt-1 rounded-md py-2 text-sm shadow-sm bg-white  ${
                    selectedOption === "POS"
                      ? "ring-1 ring-indigo-500 text-indigo-500"
                      : " text-gray-400"
                  }`}
                  onClick={() => handleOptionClick("POS")}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      width="17"
                      height="15"
                      viewBox="0 0 17 15"
                      xmlns="http://www.w3.org/2000/svg"
                      fill={selectedOption === "POS" ? "blue" : "gray"}
                      fillOpacity={selectedOption === "POS" ? "0.6" : "0.6"}
                    >
                      <path d="M14.5 6H13.5V0H3.5V6H2.5C1.96957 6 1.46086 6.21071 1.08579 6.58579C0.710714 6.96086 0.5 7.46957 0.5 8V15H16.5V8C16.5 7.46957 16.2893 6.96086 15.9142 6.58579C15.5391 6.21071 15.0304 6 14.5 6ZM5.5 2H11.5V6H5.5V2ZM14.5 13H2.5V8H14.5V13ZM13.5 11H9.5V9H13.5V11Z" />
                    </svg>
                    <p
                      className={
                        selectedOption === "POS"
                          ? " text-indigo-500"
                          : "text-gray-400"
                      }
                    >
                      POS
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <label
            htmlFor="countryDropdown"
            className="text-black font-semibold mb-1 text-sm"
          >
            Country{" "}
            {/* <ReactCountryFlag
              countryCode={selectedValuesFilters.country}
              svg
            /> */}
            <span
              className={`ml-1 mr-1 flag-icon flag-icon-${selectedValuesFilters.country.toLowerCase()}`}
            ></span>
            <p className="text-gray-500 inline-block">{currencySymbol}</p>
          </label>

          {/* <div className="flex justify-center items-center w-full mb-4 mt-1 relative">
          <div className="text-lighter-gray w-full">
            <ReactFlagsSelect
              selected={selectedValuesFilters.country}
              onSelect={(countryCode) => handleCountryChange(countryCode)}
              className="rounded-md w-full h-10 text-sm text-gray bg-white items-start"
              optionsSize={14}
              selectedSize={14}
            />
            </div>
          </div> */}

          <div className="flex justify-center items-center w-full mb-4 mt-1 relative gap-1">
            {/* <div className="bg-white h-10 w-8 flex justify-center items-center rounded-md"> */}

            {/* </div> */}
            <select
              className="rounded-md pt-1 pb-1 w-full h-10 text-sm pl-2 text-gray-400 cursor-pointer border-none focus:outline-none"
              value={selectedValuesFilters.country}
              onChange={handleCountryChange}
            >
              <option value="option1">Choose country</option>
              {countries.map((country, index) => (
                <option key={index} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <label
            htmlFor="currencyDropdown"
            className="text-black font-semibold mb-1 text-sm"
          >
            Currency
          </label>
          <div className="flex justify-center items-center w-full mb-4 mt-1 relative">
            <select
              id="currencyDropdown"
              className="rounded-md pt-1 pb-1 w-full h-10 text-sm pl-2 text-gray-400 border-none cursor-pointer focus:outline-none"
              onChange={handleCurrencyChange}
              value={selectedValuesFilters.currency}
            >
              <option value="option1">Choose currency</option>

              {Array.isArray(currencies) &&
                currencies.map((currency, index) => (
                  <option key={index} value={currency}>
                    {currency}
                  </option>
                ))}
            </select>
            
            {/* <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
              <svg
                height="20"
                viewBox="0 0 48 48"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M14 20l10 10 10-10z" />
                <path d="M0 0h48v48h-48z" fill="none" />
              </svg>
            </div> */}
          </div>

          {/* <label
            htmlFor="textInput"
            className="text-black font-semibold mb-1 text-sm"
          >
            Requirements
          </label> */}

          <div className="w-full mb-4 text-black rounded-md relative mt-4">
            {/* <textarea
              id="textInput"
              className="p-3 resize-none rounded-md w-full text-sm h-20 border-none bg-white focus:outline-none"
              placeholder=""
              onChange={handleInputChange}
            />
            <span className="absolute top-0 left-0 ml-3 mt-2 text-gray transition-all duration-300 pointer-events-none rounded-xl bg-white focus:ring-lilac">
              Requirements
            </span> */}
            <div className="relative">
              <input
                type="text"
                id="floating_outlined"
                className="block px-2.5 pb-2.5 pt-4 w-full h-20 text-sm  text-black bg-white rounded-lg border border-gray-300 dark:text-black dark:border-gray-200 dark:focus:border-gray-400 focus:outline-none focus:ring- focus:border-gray-400 peer"
                placeholder=" "
                onChange={handleInputChange}
              />
              <label
                htmlFor="floating_outlined"
                className="absolute text-md rounded-md text-gray-500 bg-white dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]  px-2 peer-focus:px-2 peer-focus:text-gray-500 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Requirements
              </label>
            </div>
          </div>

          <div className="flex items-center w-full mb-1 gap-2">
            <input
              type="checkbox"
              id="consultationCheckbox"
              onChange={handleConsultationChange}
              checked={consultationNeeded}
              className="bg h-4 w-4 border border-gray-400 rounded checked:bg-black checked:border-transparent focus:outline-none focus:bg-black"
            />
            <label
              htmlFor="consultationCheckbox"
              className="text-black font-semibold text-sm"
            >
              I need consultation
            </label>
          </div>

          <button
            type="button"
            className={`mt-2 px-4 py-2 mb-2 text-white rounded-md transition-colors w-full
                ${
                  isButtonDisabled
                    ? " bg-indigo-500 bg-opacity-55 cursor-not-allowed"
                    : "hover:border-gray-300 bg-indigo-500 hover:bg-blue-500 cursor-pointer"
                }`}
            onClick={handleButtonClick}
            disabled={isButtonDisabled}
          >
            {isLoading && (
              <div className="flex justify-center items-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-100"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray="60 40"
                    fill="none"
                  />
                </svg>
              </div>
            )}
            {!isLoading && "Submit 🡢"}
          </button>
        </div>

        <div className="justify-center w-full max-w-96">
          <div className="flex justify-end mt-4">
            <a href="#" className="mr-8 text-xs">
              Help
            </a>
            <a href="#" className="mr-8 text-xs">
              Privacy
            </a>
            <a href="#" className="text-xs">
              Terms
            </a>
          </div>
        </div>

        <div className="justify-center w-full max-w-96">
          <div className="mt-16 text-center font-medium font-mono">
            {isLoading && <LoaderWithFacts setIsLoading={setIsLoading} />}
          </div>
        </div>

        {isPopupVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md max-w-4xl w-auto max-h-3/4 min-h-20 h-auto overflow-x-auto overflow-y-auto relative text-black">
              <button
                className="absolute pb-2 top-2 right-2 text-gray-600 hover:text-gray-800"
                onClick={handleClosePopup}
              >
                <svg
                  className="h-6 w-6 pt-2 pr-2"
                  fill="gray"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
              <div dangerouslySetInnerHTML={{ __html: responseText }} />
            </div>
          </div>
        )}

        {isContactPopupVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-md max-w-3xl w-full max-h-3/4 min-h-20 h-auto overflow-x-auto overflow-y-auto relative text-black">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                onClick={handleCloseContactPopup}
              >
                <svg
                  className="h-6 w-6"
                  fill="gray"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
              <div className="p-4 ">
                <div className="text-center pt-2 pb-4">
                  <text className="text-2xl font-semibold">
                    Contact Information
                  </text>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        )}
      </main>
    </body>
  );
}
