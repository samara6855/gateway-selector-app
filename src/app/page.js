"use client";
import "flag-icon-css/css/flag-icons.min.css";
import LoaderWithFacts from "../../components/LoaderWithFacts";
import ContactForm from "../../components/ContactForm";
import { getCountries } from "country-state-picker";
import { getAllCurrencies } from "../../components/currencyAPI";
import getSymbolFromCurrency from "currency-symbol-map";
import { Country } from "country-state-city";
import { countryToAlpha2 } from "country-to-iso"; // https://www.npmjs.com/package/country-to-iso
import PaymentIcon from "react-payment-icons"; // https://www.npmjs.com/package/react-payment-icons

import "./globals.css";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Payment Gateway");
  const [inputText, setInputText] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const [isContactPopupVisible, setContactPopupVisibility] = useState(false);
  const [consultationNeeded, setConsultationNeeded] = useState(true);
  const [currencies, setCurrencies] = useState([]);
  const [product, setProduct] = useState(null);
  const [isPGFullScreen, setPGFullScreen] = useState(false);
  const [isPOSFullScreen, setPOSFullScreen] = useState(false);
  const [isPGPopupVisible, setIsPopupVisible] = useState(false);
  const [isPOSPopupVisible, setIsPOSPopupVisible] = useState(false);
  const [selectedGateways, setSelectedGateways] = useState([]);
  const [selectedPOS, setSelectedPOS] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [finalCompareResponse, setFinalCompareResponse] = useState("");
  const [finalCompareResponsePOS, setFinalCompareResponsePOS] = useState("");
  const [buttonText, setButtonText] = useState(null);

  const [selectedValuesFilters, setSelectedValuesFilters] = useState({
    country: "option1",
    currency: "option1",
  });

  const handleClosePGPopup = () => {
    setIsPopupVisible(false);
  };

  const handleClosePOSPopup = () => {
    setIsPOSPopupVisible(false);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleResizePopup = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleResizePGPopup = () => {
    setPGFullScreen(!isPGFullScreen);
  };

  const handleResizePOSPopup = () => {
    setPOSFullScreen(!isPOSFullScreen);
  };

  const handleScheduleSubmit = async (event) => {
    window.open("https://crabroom.com/hr-interview", "_blank");
  };

  const handleSelectOption = (countryCode) => {
    handleCountryChange(countryCode);
    setIsOpen(false);
  };

  // const [selectedValuesPOS, setSelectedValuesPOS] = useState({
  //   country: 'option1',
  //   currency: 'option1'
  // });

  const handleToggle = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      handleOptionClick("POS");
    } else {
      handleOptionClick("Payment Gateway");
    }
  };

  const handleConsultationChange = (event) => {
    const { checked } = event.target;
    setConsultationNeeded(checked);

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
        const storedButtonText = sessionStorage.getItem("buttonText");
        if (storedButtonText) {
          setButtonText(storedButtonText);
        }
        console.log(currenciesData);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };
    fetchCurrencies();

    sessionStorage.setItem("product", "payment gateway");

    sessionStorage.setItem("consultationNeeded", "yes");
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.body.addEventListener("click", handleClickOutside);

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

      setProduct(product);

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

      const productCB = sessionStorage.getItem("product");

      try {
        const responseCustomButton = await fetch(
          `https://pctv2tnnnwowuf4mj37cjrzdiy0sarhn.lambda-url.us-east-1.on.aws/?product=${productCB}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userinput: inputText,
              country: country,
              currency: currency,
            }),
          }
        );

        if (!responseCustomButton.ok) {
          console.log("No customization");
          setButtonText("I Need Consultation");
          // const buttonText = "I Need Consultation";
          // throw new Error("Failed to fetch data");
        }

        const responseDataCB = await responseCustomButton.json();
        const botResponseCB = responseDataCB.bot.trim();
        console.log(botResponseCB);
        sessionStorage.setItem("buttonText", botResponseCB);
      } catch (error) {
        console.error("Error:", error.message);
        // Handle the error if necessary
      }

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

  function PaymentGatewayPopup({ finalCompareResponse, selectedGateways }) {
    const [showAll, setShowAll] = useState(false);
    const [showLanguages, setShowLanguages] = useState(false);
    const [showCurrencies, setShowCurrencies] = useState(false);
    const [showCountries, setShowCountries] = useState(false);

    const toggleShowAll = () => {
      setShowAll(!showAll);
    };

    const toggleShowLanguages = () => {
      setShowLanguages(!showLanguages);
    };

    const toggleShowCurrencies = () => {
      setShowCurrencies(!showCurrencies);
    };

    const toggleShowCountries = () => {
      setShowCountries(!showCountries);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
        <div
          className={`bg-white rounded-lg shadow-md ${
            isPGFullScreen
              ? "w-screen h-screen"
              : "max-w-4xl w-auto max-h-3/4 min-h-20"
          }  overflow-y-auto relative text-black custom-scrollbar`}
        >
          <div className="p-4">
            <button
              className="absolute top-3 right-auto mb-2 text-gray-600 hover:text-gray-800"
              onClick={handleClosePGPopup}
            >
              <svg
                data-name="Layer 1"
                id="Layer_1"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
              >
                <title />
                <path
                  d="M27,14H9.83l6.58-6.59a2,2,0,0,0-2.82-2.82l-10,10a1.79,1.79,0,0,0-.25.31,1.19,1.19,0,0,0-.09.15l-.1.2-.06.2a.84.84,0,0,0,0,.17,2,2,0,0,0,0,.78.84.84,0,0,0,0,.17l.06.2c0,.07.07.13.1.2a1.19,1.19,0,0,0,.09.15,1.79,1.79,0,0,0,.25.31l10,10a2,2,0,0,0,2.82-2.82L9.83,18H27a2,2,0,0,0,0-4Z"
                  fill="#5a5a5a"
                />
              </svg>
            </button>
            <button
              className={`text-gray-600 hover:text-gray-800 ${
                isPGFullScreen
                  ? "absolute top-3.5 right-2"
                  : "absolute top-2 right-2"
              }`}
              onClick={handleResizePGPopup}
            >
              {isPGFullScreen ? (
                <svg
                  class="feather feather-minimize-2"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <polyline points="4 14 10 14 10 20" />
                  <polyline points="20 10 14 10 14 4" />
                  <line x1="14" x2="21" y1="10" y2="3" />
                  <line x1="3" x2="10" y1="21" y2="14" />
                </svg>
              ) : (
                <svg
                  fill="none"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  className="pt-2"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.8995 4.10052V2.10052H21.8995V10.1005H19.8995V5.51477L14.1213 11.293L12.7071 9.87878L18.4854 4.10052H13.8995Z"
                    fill="currentColor"
                  />
                  <path
                    d="M4.10046 13.8995H2.10046V21.8995H10.1005V19.8995H5.51468L11.2929 14.1212L9.87872 12.707L4.10046 18.4853V13.8995Z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </button>
            <h1 className="text-2xl p-1 font-semibold mt-6">
              Comparison Result
            </h1>
            <div className="max-h-full overflow-y-auto custom-scrollbar pt-2">
              {finalCompareResponse}
            </div>
            <h2 className="font-semibold text-2xl p-2">Selected Gateways</h2>
            <div className="rounded-lg overflow-x-auto custom-scrollbar">
              <table>
                <thead className=" bg-cyan-500 text-white rounded-md">
                  <tr className="rounded-lg">
                    <th className=" px-4 py-2 font-semibold rounded-xl">
                      Payment Gateway Name
                    </th>
                    <th className="border border-gray-200 px-4 py-2 min-w-96 font-semibold rounded-lg">
                      Payment Methods
                    </th>
                    <th className="border border-gray-200 px-4 py-2 min-w-60 font-semibold rounded-lg">
                      API Languages
                    </th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold rounded-lg">
                      Security/Compliance
                    </th>
                    <th className="border border-gray-200 px-4 py-2 min-w-60 font-semibold rounded-lg">
                      Countries
                    </th>
                    <th className="border border-gray-200 px-4 py-2 min-w-72 max-w-72 font-semibold rounded-lg">
                      Currencies
                    </th>
                    <th className="border border-gray-200 px-4 py-2 min-w-60 font-semibold rounded-lg">
                      Fee
                    </th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold rounded-lg">
                      Website
                    </th>
                  </tr>
                </thead>
                <tbody className="rounded-lg">
                  {selectedGateways.map((gateway, index) => (
                    <tr
                      key={gateway.id}
                      className={`border-b border-gray-200 rounded-lg ${
                        index % 2 === 0 ? "" : "bg-gray-50"
                      }`}
                    >
                      <td className="border border-gray-200 px-4 py-2">
                        {gateway["Payment Gateway Name"]}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 relative">
                        {Array.isArray(gateway["Payment Methods"]) ? (
                          <>
                            {gateway["Payment Methods"]
                              .slice(0, 3)
                              .map((method, index) => (
                                <span
                                  key={index}
                                  className="border bg-gray-100 shadow-md shadow-gray-200 text-cyan-900 mr-2 mb-2 px-2 py-1 rounded-md inline-block"
                                >
                                  <span className="flex">
                                    <PaymentIcon
                                      id={method.toLowerCase()}
                                      style={{}}
                                      className="payment-icon h-6 w-6 mr-1"
                                    />
                                    {method}
                                  </span>
                                </span>
                              ))}

                            {showAll &&
                              gateway["Payment Methods"]
                                .slice(3)
                                .map((method, index) => (
                                  <span
                                    key={index}
                                    className="border bg-gray-100 shadow-md shadow-gray-200 text-cyan-900 mr-2 mb-2 px-2 py-1 rounded-md inline-block"
                                  >
                                    <span className="flex">
                                      <PaymentIcon
                                        id={method.toLowerCase()}
                                        style={{}}
                                        className="payment-icon h-6 w-6 mr-1"
                                      />
                                      {method}
                                    </span>
                                  </span>
                                ))}
                            {!showAll &&
                              gateway["Payment Methods"].length > 3 && (
                                <span
                                  onClick={toggleShowAll}
                                  className="text-cyan-300 absolute right-0 bottom-0 mr-2 mb-2 px-2 py-1 rounded-md cursor-pointer"
                                >
                                  more...
                                </span>
                              )}
                          </>
                        ) : (
                          <span className="payment-method">
                            {gateway["Payment Methods"]}
                          </span>
                        )}
                      </td>

                      <td className="border border-gray-200 px-4 py-2 relative">
                        {Array.isArray(gateway["API Languages"]) ? (
                          <>
                            {!showLanguages ? (
                              <>
                                {gateway["API Languages"]
                                  .slice(0, 3)
                                  .map((language, index) => (
                                    <span
                                      key={index}
                                      className="border bg-gray-100 shadow-md shadow-gray-200 text-cyan-900 mr-2 mb-2 px-2 py-1 rounded-md inline-block"
                                    >
                                      {language}
                                    </span>
                                  ))}

                                {gateway["API Languages"].length > 3 && (
                                  <span
                                    onClick={toggleShowLanguages}
                                    className="text-cyan-300 absolute right-0 bottom-0 mr-2 mb-2 px-2 py-1 rounded-md cursor-pointer"
                                  >
                                    more...
                                  </span>
                                )}
                              </>
                            ) : (
                              gateway["API Languages"].map(
                                (language, index) => (
                                  <span
                                    key={index}
                                    className="border bg-gray-100 shadow-md shadow-gray-200 text-cyan-900 mr-2 mb-2 px-2 py-1 rounded-md inline-block"
                                  >
                                    {language}
                                  </span>
                                )
                              )
                            )}
                          </>
                        ) : (
                          <span className="api-language">
                            {gateway["API Languages"]}
                          </span>
                        )}
                      </td>

                      <td className="border border-gray-200 px-4 py-2">
                        {Array.isArray(gateway["Security/Compliance"])
                          ? gateway["Security/Compliance"].join(", ")
                          : gateway["Security/Compliance"]}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 relative">
                        {Array.isArray(gateway.Countries) ? (
                          <>
                            {!showCountries ? (
                              <>
                                {gateway.Countries.slice(0, 3).map(
                                  (country, index) => (
                                    <span
                                      key={index}
                                      className="border bg-gray-100 shadow-md shadow-gray-200 text-cyan-900 mr-2 mb-2 px-2 py-1 rounded-md inline-block"
                                    >
                                      <span
                                        className={`ml-1 mr-1 h-4 w-4 flag-icon flag-icon-${countryToAlpha2(
                                          country
                                        ).toLowerCase()}`}
                                      ></span>
                                      {country}
                                    </span>
                                  )
                                )}
                                {gateway.Countries.length > 3 && (
                                  <span
                                    onClick={toggleShowCountries}
                                    className="text-cyan-300 absolute right-0 bottom-0 mr-2 mb-2 px-2 py-1 rounded-md cursor-pointer"
                                  >
                                    more...
                                  </span>
                                )}
                              </>
                            ) : (
                              gateway.Countries.map((country, index) => (
                                <span
                                  key={index}
                                  className="border bg-gray-100 shadow-md shadow-gray-200 text-cyan-900 mr-2 mb-2 px-2 py-1 rounded-md inline-block"
                                >
                                  <span
                                    className={`ml-1 mr-1 h-4 w-4 flag-icon flag-icon-${
                                      countryToAlpha2(country)
                                        ? countryToAlpha2(country).toLowerCase()
                                        : ""
                                    }`}
                                  ></span>

                                  {country}
                                </span>
                              ))
                            )}
                          </>
                        ) : (
                          <span className="api-country">
                            {gateway.Countries}
                          </span>
                        )}
                      </td>

                      <td className="border border-gray-200 px-4 py-2 relative">
                        {Array.isArray(gateway.Currencies) ? (
                          <>
                            {!showCurrencies ? (
                              <>
                                {gateway.Currencies.slice(0, 3).map(
                                  (currency, index) => (
                                    <span
                                      key={index}
                                      className="border bg-gray-100 shadow-md shadow-gray-200 text-cyan-900 mr-2 mb-2 px-2 py-1 rounded-md inline-block"
                                    >
                                      <span className="pr-1">
                                        {getSymbolFromCurrency(currency)}
                                      </span>
                                      {currency}
                                    </span>
                                  )
                                )}
                                {gateway.Currencies.length > 3 && (
                                  <span
                                    onClick={toggleShowCurrencies}
                                    className="text-cyan-300 mr-2 mb-2 px-2 py-1 absolute right-0 bottom-0 rounded-md inline-block cursor-pointer"
                                  >
                                    more...
                                  </span>
                                )}
                              </>
                            ) : (
                              gateway.Currencies.map((currency, index) => (
                                <span
                                  key={index}
                                  className="border bg-gray-100 shadow-md shadow-gray-200 text-cyan-900 mr-2 mb-2 px-2 py-1 rounded-md inline-block"
                                >
                                  <span className="pr-1">
                                    {getSymbolFromCurrency(currency)}
                                  </span>
                                  {currency}
                                </span>
                              ))
                            )}
                          </>
                        ) : (
                          <span className="currency">{gateway.Currencies}</span>
                        )}
                      </td>

                      <td className="border border-gray-200 px-4 py-2">
                        {Array.isArray(gateway.Fee)
                          ? gateway.Fee.join(", ")
                          : gateway.Fee}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <a href={gateway.Website}>
                          {gateway["Payment Gateway Name"]}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function POSPopup({ finalCompareResponsePOS, selectedPOS }) {
    console.log(selectedPOS);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
        <div
          className={`bg-white rounded-lg shadow-md ${
            isPOSFullScreen
              ? "w-screen h-screen"
              : "max-w-4xl w-auto max-h-3/4 min-h-20"
          } overflow-x-auto overflow-y-auto relative text-black custom-scrollbar`}
        >
          <div className="p-4">
            <button
              className="absolute top-3 right-auto mb-2 text-gray-600 hover:text-gray-800"
              onClick={handleClosePOSPopup}
            >
              <svg
                data-name="Layer 1"
                id="Layer_1"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
              >
                <title />
                <path
                  d="M27,14H9.83l6.58-6.59a2,2,0,0,0-2.82-2.82l-10,10a1.79,1.79,0,0,0-.25.31,1.19,1.19,0,0,0-.09.15l-.1.2-.06.2a.84.84,0,0,0,0,.17,2,2,0,0,0,0,.78.84.84,0,0,0,0,.17l.06.2c0,.07.07.13.1.2a1.19,1.19,0,0,0,.09.15,1.79,1.79,0,0,0,.25.31l10,10a2,2,0,0,0,2.82-2.82L9.83,18H27a2,2,0,0,0,0-4Z"
                  fill="#5a5a5a"
                />
              </svg>
            </button>
            <button
              className={`text-gray-600 hover:text-gray-800 ${
                isPOSFullScreen
                  ? "absolute top-3.5 right-2"
                  : "absolute top-2 right-2"
              }`}
              onClick={handleResizePOSPopup}
            >
              {isPOSFullScreen ? (
                <svg
                  class="feather feather-minimize-2"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <polyline points="4 14 10 14 10 20" />
                  <polyline points="20 10 14 10 14 4" />
                  <line x1="14" x2="21" y1="10" y2="3" />
                  <line x1="3" x2="10" y1="21" y2="14" />
                </svg>
              ) : (
                <svg
                  fill="none"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  className="pt-2"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.8995 4.10052V2.10052H21.8995V10.1005H19.8995V5.51477L14.1213 11.293L12.7071 9.87878L18.4854 4.10052H13.8995Z"
                    fill="currentColor"
                  />
                  <path
                    d="M4.10046 13.8995H2.10046V21.8995H10.1005V19.8995H5.51468L11.2929 14.1212L9.87872 12.707L4.10046 18.4853V13.8995Z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </button>

            <h1 className="text-2xl p-1 font-semibold pt-4">
              Comparison Result
            </h1>
            {finalCompareResponsePOS}

            <div className="max-h-full overflow-y-auto pt-4">
              <h2 className="text-2xl font-semibold pb-4">POS Data</h2>
              <table className="rounded-md pt-4">
                <thead className="bg-cyan-500 text-white">
                  <tr>
                    <th className="border border-gray-200 px-4 py-2 font-semibold">
                      POS Name
                    </th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold min-w-60 pt-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Reviews</span>
                        <div className="flex flex-row border-t border-gray-200 mt-1 pt-1">
                          <span className="flex-1 text-xs font-normal text-center">
                            Google Reviews
                          </span>
                          <span className="flex-1 text-xs font-normal text-center border-l border-gray-200">
                            Trust Pilot Reviews
                          </span>
                        </div>
                      </div>
                    </th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold min-w-52">
                      Device Cost
                    </th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold min-w-48">
                      Works with (Payment Gateway)
                    </th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold min-w-40">
                      Payment processing cost
                    </th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold">
                      Industries
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPOS.map((pos, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-200 ${
                        index % 2 === 0 ? "" : "bg-cyan-50"
                      }`}
                    >
                      <td className="border border-gray-200 px-4 py-2">
                        {pos.posData["POS Name"] || "-"}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <div className="flex flex-row">
                          <span className="flex-1 text-sm font-normal text-center">
                            {pos.posData["Google Reviews"] || "-"}
                          </span>
                          <span className="flex-1 text-sm font-normal text-center border-l border-gray-200">
                            {pos.posData["Trust Pilot Reviews"] || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {pos.posData["Device Cost"] || "-"}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {pos.posData["Works with (Payment Gateway)"] || "-"}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {pos.posData["Payment processing cost"] || "-"}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {pos.posData["Industries"] || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function PaymentGateways({ responseText }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [checkedCount, setCheckedCount] = useState(0);
    const [checkedBoxes, setCheckedBoxes] = useState({});
    let filteredGateways = [];
    const [showDropdown, setShowDropdown] = useState(false);

    // const [finalCompareResponse, setFinalCompareResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [showLanguages, setShowLanguages] = useState(false);
    const [showCurrencies, setShowCurrencies] = useState(false);
    const [showCountries, setShowCountries] = useState(false);
    const [showPMinfo, setShowPMinfo] = useState(false);
    const [showAPILangInfo, setShowAPILangInfo] = useState(false);
    const [showSecurityInfo, setShowSecurityInfo] = useState(false);
    const [showCountriesInfo, setShowCountriesInfo] = useState(false);
    const [showCurrenciesInfo, setShowCurrenciesInfo] = useState(false);
    const [showFeeInfo, setShowFeeInfo] = useState(false);
    const [showWebsiteInfo, setShowWebsiteInfo] = useState(false);
    const [showPMFilter, setShowPMFilter] = useState(false);
    const [showAPILangFilter, setShowAPILangFilter] = useState(false);
    const [showSecurityFilter, setShowSecurityFilter] = useState(false);
    const [showCountriesFilter, setShowCountriesFilter] = useState(false);
    const [showCurrenciesFilter, setShowCurrenciesFilter] = useState(false);

    // Add state variables
    const [selectedMethods, setSelectedMethods] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [selectedSecurityOptions, setSelectedSecurityOptions] = useState([]);
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [selectedCurrencies, setSelectedCurrencies] = useState([]);

    // const [selectedGateways, setSelectedGateways] = useState([]);

    const toggleShowAll = () => {
      setShowAll(!showAll);
    };

    const handleMoreClick = () => {
      setShowDropdown(!showDropdown);
    };

    const handleMethodSelect = (value) => {
      setSelectedMethods((prevMethods) =>
        prevMethods.includes(value)
          ? prevMethods.filter((method) => method !== value)
          : [...prevMethods, value]
      );
    };

    const handleLanguageSelect = (value) => {
      setSelectedLanguages((prevLanguages) =>
        prevLanguages.includes(value)
          ? prevLanguages.filter((lang) => lang !== value)
          : [...prevLanguages, value]
      );
    };

    const handleSecurityOptionSelect = (value) => {
      setSelectedSecurityOptions((prevOptions) =>
        prevOptions.includes(value)
          ? prevOptions.filter((option) => option !== value)
          : [...prevOptions, value]
      );
    };

    const handleCountrySelect = (value) => {
      setSelectedCountries((prevCountries) =>
        prevCountries.includes(value)
          ? prevCountries.filter((country) => country !== value)
          : [...prevCountries, value]
      );
    };

    const handleCurrencySelect = (value) => {
      setSelectedCurrencies((prevCurrencies) =>
        prevCurrencies.includes(value)
          ? prevCurrencies.filter((currency) => currency !== value)
          : [...prevCurrencies, value]
      );
    };

    const toggleShowLanguages = () => {
      setShowLanguages(!showLanguages);
    };

    const toggleShowCurrencies = () => {
      setShowCurrencies(!showCurrencies);
    };

    const toggleShowCountries = () => {
      setShowCountries(!showCountries);
    };

    let response;

    useEffect(() => {
      if (response && response["Payment Gateways"]) {
        const initialCheckedBoxes = {};
        response["Payment Gateways"].forEach((gateway, index) => {
          initialCheckedBoxes[gateway.id] = false;
        });
        setCheckedBoxes(initialCheckedBoxes);
      }
    }, [response]);

    const handleCheckboxChange = (id, gatewayData) => {
      const newCheckedBoxes = { ...checkedBoxes };
      newCheckedBoxes[id] = !newCheckedBoxes[id];
      setCheckedBoxes(newCheckedBoxes);

      const isChecked = newCheckedBoxes[id];
      setCheckedCount((prevCount) =>
        isChecked ? prevCount + 1 : prevCount - 1
      );

      const sessionStorageKey = `checkbox_${id}`;
      if (isChecked) {
        sessionStorage.setItem(sessionStorageKey, JSON.stringify(gatewayData));
      } else {
        sessionStorage.removeItem(sessionStorageKey);
      }
    };

    const filterTableData = () => {
      return response["Payment Gateways"].filter((gateway) => {
        const gatewayMethods = gateway["Payment Methods"];
        const gatewayLanguages = gateway["API Languages"];
        const gatewaySecurityOptions = gateway["Security/Compliance"];
        const gatewayCountries = gateway["Countries"];
        const gatewayCurrencies = gateway["Currencies"];

        return (
          selectedMethods.every((method) => gatewayMethods.includes(method)) &&
          selectedLanguages.every((lang) => gatewayLanguages.includes(lang)) &&
          selectedSecurityOptions.every((option) =>
            gatewaySecurityOptions.includes(option)
          ) &&
          selectedCountries.every((country) =>
            gatewayCountries.includes(country)
          ) &&
          selectedCurrencies.every((currency) =>
            gatewayCurrencies.includes(currency)
          )
        );
      });
    };

    const handleCompareClick = async () => {
      try {
        // Set isLoading to true to indicate loading state
        setIsLoading(true);

        function retrieveCheckboxSessionStorageItems() {
          const items = {};

          // Loop through sessionStorage keys
          for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);

            // Check if key starts with "checkbox_"
            if (key.startsWith("checkbox_")) {
              // Retrieve the item from sessionStorage
              const item = sessionStorage.getItem(key);

              // Parse the item value from JSON
              const parsedItem = JSON.parse(item);

              // Add the item to the result object
              items[key] = parsedItem;
            }
          }

          return items;
        }

        const checkboxItems = retrieveCheckboxSessionStorageItems();
        const checkboxItemsJson = JSON.stringify(checkboxItems);

        let currencyVal = sessionStorage.getItem("currency");
        if (!currencyVal) {
          currencyVal = null;
        }

        let countryVal = sessionStorage.getItem("country");
        if (!countryVal) {
          countryVal = null;
        }

        let inputVal = inputText;
        if (!inputText) {
          inputVal = null;
        }

        const compareResponse = await fetch(
          `https://ut4vfwn4rrk53nl36ymmnv3xem0iezgi.lambda-url.us-east-1.on.aws/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              checkboxItems: checkboxItemsJson,
              country: countryVal,
              currency: currencyVal,
              userinput: inputVal,
            }),
          }
        );

        if (!compareResponse.ok) {
          console.log("error receiving response");
          throw new Error("Failed to fetch data");
        }

        const compareResponseData = await compareResponse.json();
        const finalCompareResponse = compareResponseData.bot.trim();
        console.log(finalCompareResponse);

        const paragraphs = finalCompareResponse
          .split("\n")
          .map((paragraph, index) => (
            <p key={index}>
              <br></br>
              {paragraph}
            </p>
          ));

        const selectedGateways = Object.values(checkboxItems);
        console.log(selectedGateways);

        setSelectedGateways(selectedGateways);

        // Set finalCompareResponse state
        setFinalCompareResponse(paragraphs);
        // Set finalCompareResponse state
        // setFinalCompareResponse(finalCompareResponse);

        // Set isLoading to false to indicate end of loading state
        setIsLoading(false);

        // Show the popup
        setIsPopupVisible(true);
      } catch (error) {
        console.error("Error occurred:", error);
        setIsLoading(false); // Ensure isLoading is set to false in case of errors
      }
    };

    try {
      response = JSON.parse(responseText);

      response["Payment Gateways"].forEach((gateway, index) => {
        gateway.id = index;
      });

      filteredGateways = response["Payment Gateways"].filter((gateway) => {
        const gatewayValues = Object.values(gateway);
        for (const value of gatewayValues) {
          if (
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            return true;
          }
          if (Array.isArray(value)) {
            for (const item of value) {
              if (
                typeof item === "string" &&
                item.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                return true;
              }
            }
          }
        }
        return false;
      });
    } catch (error) {
      return <p>Requirement is unrelated to Payment Gateways.</p>;
    }

    return (
      <div className="flex flex-col">
        <div className="min-w-1/2 md:w-1/2 m-4">
          <form className="flex items-center">
            <label
              htmlFor="simple-search"
              className="sr-only border border-cyan-100"
            >
              Search
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-300 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="simple-search"
                className="bg-gray-100 border min-w-72 border-gray-200 text-gray-900 text-sm rounded-lg focus:outline-none block w-full pl-10 p-2 dark:placeholder-gray-400 dark:text-black"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-center ml-2 mb-2">
              <button
                className={`bg-cyan-500 text-white px-4 py-2 w-40 mt-2 rounded-lg focus:outline-none relative ${
                  isLoading ? "opacity-50 pointer-events-none" : ""
                } ${checkedCount < 2 ? "opacity-50 pointer-events-none" : ""}`}
                onClick={!isLoading ? handleCompareClick : undefined}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className=" flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
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
                ) : (
                  `Compare(${checkedCount})`
                )}
              </button>
            </div>
            <div className="ml-2">
              <button
                type="button"
                className="mt-2 px-4 py-2 mb-2 text-white rounded-md transition-colors w-full bg-cyan-500 min-w-60"
                onClick={handleScheduleSubmit}
              >
                {/* I need consultation 🡢 */}
                {buttonText ? buttonText : "I need consultation 🡢"}
              </button>
            </div>
          </form>
        </div>

        <div
          className={`overflow-x-auto  overflow-y-auto custom-scrollbar ${
            isFullScreen ? "max-h-screen" : "max-h-96"
          }`}
        >
          <table className="rounded-lg">
            <thead className=" bg-cyan-500 text-white rounded-md">
              <tr>
                <th className=" px-4 py-2 font-semibold rounded-lg">Select</th>
                <th className="border border-gray-200 px-4 py-2 font-semibold rounded-lg min-w-40">
                  Payment Gateway Name
                </th>
                <th className="border border-gray-200 px-4 py-2 min-w-72 font-semibold rounded-lg relative">
                  <div className="flex justify-center items-center ">
                    Payment Methods
                    <span
                      className="pl-1 h-3 w-3 text-gray-300 cursor-pointer mb-2"
                      onMouseEnter={() => setShowPMinfo(true)}
                      onMouseLeave={() => setShowPMinfo(false)}
                    >
                      <svg
                        enable-background="new 0 0 48 48"
                        height={24}
                        id="Layer_3"
                        version="1.1"
                        viewBox="0 0 48 48"
                        width={24}
                        className="h-4 w-4 mt-1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M24,48c13.255,0,24-10.745,24-24S37.255,0,24,0S0,10.745,0,24S10.745,48,24,48z M22,36.5V19.438h4V36.5H22z   M24,11.5c1.106,0,2,0.896,2,2s-0.895,2-2,2c-1.103,0-2-0.896-2-2S22.896,11.5,24,11.5z"
                          fill="#ffffff"
                        />
                      </svg>
                    </span>
                    {showPMinfo && (
                      <div className="absolute bg-gray-100 border border-gray-200 p-2 rounded shadow z-20 top-3/4 ml-2">
                        <p className="text-sm text-cyan-900 font-normal">
                          A payment method refers to the various options
                          available for customers to make payments when
                          purchasing a product or service.
                        </p>
                      </div>
                    )}
                    <span
                      className="pl-4 mt-1 text-gray-300 cursor-pointer"
                      onClick={() => setShowPMFilter(!showPMFilter)}
                    >
                      <svg
                        viewBox="0 0 512 512"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                      >
                        <path
                          d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM390.6 246.6l-112 112C272.4 364.9 264.2 368 256 368s-16.38-3.125-22.62-9.375l-112-112c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L256 290.8l89.38-89.38c12.5-12.5 32.75-12.5 45.25 0S403.1 234.1 390.6 246.6z"
                          fill="#ffffff"
                        />
                      </svg>
                    </span>
                    {showPMFilter && (
                      <div className="absolute bg-gray-100 border border-gray-200 p-2 rounded shadow z-10 max-h-40 overflow-y-auto top-full mt-1 custom-scrollbar">
                        {response["Payment Gateways"]
                          .flatMap((gateway) => gateway["Payment Methods"])
                          .filter(
                            (method, index, self) =>
                              self.indexOf(method) === index
                          )
                          .map((method, index) => (
                            <label
                              key={index}
                              className="flex flex-row justify-start cursor-pointer text-cyan-900 font-normal text-sm gap-1"
                            >
                              <input
                                type="checkbox"
                                className="pr-1 checked:bg-cyan-400"
                                value={method}
                                checked={selectedMethods.includes(method)}
                                onChange={(e) =>
                                  handleMethodSelect(e.target.value)
                                }
                              />
                              {method}
                            </label>
                          ))}
                      </div>
                    )}
                  </div>
                </th>

                <th className="border border-gray-200 px-4 py-2 min-w-60 font-semibold rounded-lg relative">
                  <div className="flex justify-center items-center">
                    API Languages
                    <span
                      className="pl-1 mt-2 text-gray-300 cursor-pointer mb-1"
                      onMouseEnter={() => setShowAPILangInfo(true)}
                      onMouseLeave={() => setShowAPILangInfo(false)}
                    >
                      <svg
                        enable-background="new 0 0 48 48"
                        height={24}
                        id="Layer_3"
                        version="1.1"
                        viewBox="0 0 48 48"
                        width={24}
                        className="h-4 w-4 "
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M24,48c13.255,0,24-10.745,24-24S37.255,0,24,0S0,10.745,0,24S10.745,48,24,48z M22,36.5V19.438h4V36.5H22z   M24,11.5c1.106,0,2,0.896,2,2s-0.895,2-2,2c-1.103,0-2-0.896-2-2S22.896,11.5,24,11.5z"
                          fill="#ffffff"
                        />
                      </svg>
                    </span>
                    {showAPILangInfo && (
                      <div className="absolute bg-gray-100 border border-gray-200 p-2 rounded shadow z-20 top-3/4 ml-2">
                        <p className="text-sm text-cyan-900 font-normal">
                          API Languages refers to the programming languages
                          supported by an API for developers to interact with
                          it.
                        </p>
                      </div>
                    )}
                    <span
                      className="pl-2 text-gray-300 cursor-pointer mt-1"
                      onClick={() => setShowAPILangFilter(!showAPILangFilter)}
                    >
                      <svg
                        viewBox="0 0 512 512"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                      >
                        <path
                          d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM390.6 246.6l-112 112C272.4 364.9 264.2 368 256 368s-16.38-3.125-22.62-9.375l-112-112c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L256 290.8l89.38-89.38c12.5-12.5 32.75-12.5 45.25 0S403.1 234.1 390.6 246.6z"
                          fill="#ffffff"
                        />
                      </svg>
                    </span>
                    {showAPILangFilter && (
                      <div className="absolute bg-gray-100 border border-gray-200 p-2 rounded shadow z-10 max-h-40 overflow-y-auto top-full mt-1 custom-scrollbar">
                        {response["Payment Gateways"]
                          .flatMap((language) => language["API Languages"])
                          .filter(
                            (lang, index, self) => self.indexOf(lang) === index
                          )
                          .map((lang, index) => (
                            <label
                              key={index}
                              className="flex flex-row justify-start cursor-pointer text-cyan-900 font-normal text-sm gap-1"
                            >
                              <input
                                type="checkbox"
                                className="pr-1"
                                value={lang}
                                checked={selectedLanguages.includes(lang)}
                                onChange={(e) =>
                                  handleLanguageSelect(e.target.value)
                                }
                              />
                              {lang}
                            </label>
                          ))}
                      </div>
                    )}
                  </div>
                </th>

                <th className="border border-gray-200 px-4 py-2 font-semibold rounded-lg relative min-w-60">
                  <div className="flex justify-center items-center">
                    Security/Compliance
                    <span
                      className="pl-1 h-4 w-4 text-gray-300 cursor-pointer "
                      onMouseEnter={() => setShowSecurityInfo(true)}
                      onMouseLeave={() => setShowSecurityInfo(false)}
                    >
                      <svg
                        enable-background="new 0 0 48 48"
                        height={24}
                        id="Layer_3"
                        version="1.1"
                        viewBox="0 0 48 48"
                        width={24}
                        className="h-4 w-4 "
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M24,48c13.255,0,24-10.745,24-24S37.255,0,24,0S0,10.745,0,24S10.745,48,24,48z M22,36.5V19.438h4V36.5H22z   M24,11.5c1.106,0,2,0.896,2,2s-0.895,2-2,2c-1.103,0-2-0.896-2-2S22.896,11.5,24,11.5z"
                          fill="#ffffff"
                        />
                      </svg>
                    </span>
                    {showSecurityInfo && (
                      <div className="absolute bg-gray-100 border border-gray-200 p-2 rounded shadow z-10 top-3/4 ml-2">
                        <p className="text-sm text-cyan-900 font-normal">
                          Security/Compliance refers to the measures taken by a
                          service provider to ensure data security and
                          regulatory compliance.
                        </p>
                      </div>
                    )}
                    <span
                      className="pl-2 h-5 w-5 text-gray-300 cursor-pointer mt-1"
                      onClick={() => setShowSecurityFilter(!showSecurityFilter)}
                    >
                      <svg
                        viewBox="0 0 512 512"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                      >
                        <path
                          d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM390.6 246.6l-112 112C272.4 364.9 264.2 368 256 368s-16.38-3.125-22.62-9.375l-112-112c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L256 290.8l89.38-89.38c12.5-12.5 32.75-12.5 45.25 0S403.1 234.1 390.6 246.6z"
                          fill="#ffffff"
                        />
                      </svg>
                    </span>
                    {showSecurityFilter && (
                      <div className="absolute bg-gray-100 border border-gray-200 p-2 rounded shadow z-10 max-h-40 overflow-y-auto top-full mt-1 custom-scrollbar">
                        {/* Replace response["Security/Compliance Options"] with your API response */}
                        {response["Payment Gateways"]
                          .flatMap(
                            (security) => security["Security/Compliance"]
                          )
                          .filter(
                            (lang, index, self) => self.indexOf(lang) === index
                          )
                          .map((option, index) => (
                            <label
                              key={index}
                              className="flex flex-row justify-start cursor-pointer text-cyan-900 font-normal text-sm gap-1 mt-1"
                            >
                              <input
                                type="checkbox"
                                className="pr-1"
                                value={option}
                                checked={selectedSecurityOptions.includes(
                                  option
                                )}
                                onChange={(e) =>
                                  handleSecurityOptionSelect(e.target.value)
                                }
                              />
                              {option}
                            </label>
                          ))}
                      </div>
                    )}
                  </div>
                </th>

                <th className="border border-gray-200 px-4 py-2 min-w-60 font-semibold rounded-lg relative">
                  <div className="flex justify-center items-center">
                    Countries
                    <span
                      className="pl-1 h-5 w-5 text-gray-300 cursor-pointer mt-1"
                      onMouseEnter={() => setShowCountriesInfo(true)}
                      onMouseLeave={() => setShowCountriesInfo(false)}
                    >
                      <svg
                        enable-background="new 0 0 48 48"
                        height={24}
                        id="Layer_3"
                        version="1.1"
                        viewBox="0 0 48 48"
                        width={24}
                        className="h-4 w-4 "
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M24,48c13.255,0,24-10.745,24-24S37.255,0,24,0S0,10.745,0,24S10.745,48,24,48z M22,36.5V19.438h4V36.5H22z   M24,11.5c1.106,0,2,0.896,2,2s-0.895,2-2,2c-1.103,0-2-0.896-2-2S22.896,11.5,24,11.5z"
                          fill="#ffffff"
                        />
                      </svg>
                    </span>
                    {showCountriesInfo && (
                      <div className="absolute bg-gray-100 border border-gray-200 p-2 rounded shadow z-10 top-3/4 ml-2">
                        <p className="text-sm text-cyan-900 font-normal">
                          Countries refers to the list of nations where a
                          service or product is available or supported.
                        </p>
                      </div>
                    )}
                    <span
                      className="pl-2 h-5 w-5 text-gray-300 cursor-pointer mt-1"
                      onClick={() =>
                        setShowCountriesFilter(!showCountriesFilter)
                      }
                    >
                      <svg
                        viewBox="0 0 512 512"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                      >
                        <path
                          d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM390.6 246.6l-112 112C272.4 364.9 264.2 368 256 368s-16.38-3.125-22.62-9.375l-112-112c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L256 290.8l89.38-89.38c12.5-12.5 32.75-12.5 45.25 0S403.1 234.1 390.6 246.6z"
                          fill="#ffffff"
                        />
                      </svg>
                    </span>
                    {showCountriesFilter && (
                      <div className="absolute bg-gray-100 border border-gray-200 p-2 rounded shadow z-10 max-h-40 overflow-y-auto top-full mt-1 custom-scrollbar">
                        {/* Replace response["Countries"] with your API response */}
                        {response["Payment Gateways"]
                          .flatMap((countries) => countries["Countries"])
                          .filter(
                            (country, index, self) =>
                              self.indexOf(country) === index
                          )
                          .map((country, index) => (
                            <label
                              key={index}
                              className="flex flex-row justify-start cursor-pointer text-cyan-900 font-normal text-sm gap-1"
                            >
                              <input
                                type="checkbox"
                                className="pr-1"
                                value={country}
                                checked={selectedCountries.includes(country)}
                                onChange={(e) =>
                                  handleCountrySelect(e.target.value)
                                }
                              />
                              {country}
                            </label>
                          ))}
                      </div>
                    )}
                  </div>
                </th>

                <th className="border border-gray-200 px-4 py-2 min-w-72 max-w-72 font-semibold rounded-lg relative">
                  <div className="flex justify-center items-center">
                    Currencies
                    <span
                      className="pl-1 h-5 w-5 text-gray-300 cursor-pointer mt-1"
                      onMouseEnter={() => setShowCurrenciesInfo(true)}
                      onMouseLeave={() => setShowCurrenciesInfo(false)}
                    >
                      <svg
                        enable-background="new 0 0 48 48"
                        height={24}
                        id="Layer_3"
                        version="1.1"
                        viewBox="0 0 48 48"
                        width={24}
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M24,48c13.255,0,24-10.745,24-24S37.255,0,24,0S0,10.745,0,24S10.745,48,24,48z M22,36.5V19.438h4V36.5H22z   M24,11.5c1.106,0,2,0.896,2,2s-0.895,2-2,2c-1.103,0-2-0.896-2-2S22.896,11.5,24,11.5z"
                          fill="#ffffff"
                        />
                      </svg>
                    </span>
                    {showCurrenciesInfo && (
                      <div className="absolute bg-gray-100 border border-gray-200 p-2 rounded shadow z-10 top-3/4 ml-2">
                        <p className="text-sm text-cyan-900 font-normal">
                          Currencies refers to the types of currency accepted
                          for transactions.
                        </p>
                      </div>
                    )}
                    <span
                      className="pl-2 h-5 w-5 text-gray-300 cursor-pointer mt-1"
                      onClick={() =>
                        setShowCurrenciesFilter(!showCurrenciesFilter)
                      }
                    >
                      <svg
                        viewBox="0 0 512 512"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                      >
                        <path
                          d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM390.6 246.6l-112 112C272.4 364.9 264.2 368 256 368s-16.38-3.125-22.62-9.375l-112-112c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L256 290.8l89.38-89.38c12.5-12.5 32.75-12.5 45.25 0S403.1 234.1 390.6 246.6z"
                          fill="#ffffff"
                        />
                      </svg>
                    </span>
                    {showCurrenciesFilter && (
                      <div className="absolute bg-gray-100 border border-gray-200 p-2 rounded shadow z-10 max-h-40 overflow-y-auto top-full mt-1 custom-scrollbar">
                        {response["Payment Gateways"]
                          .flatMap((currencies) => currencies["Currencies"])
                          .filter(
                            (currency, index, self) =>
                              self.indexOf(currency) === index
                          )
                          .map((currency, index) => (
                            <label
                              key={index}
                              className="flex flex-row justify-start cursor-pointer text-cyan-900 font-normal text-sm gap-1"
                            >
                              <input
                                type="checkbox"
                                className="pr-1"
                                value={currency}
                                checked={selectedCurrencies.includes(currency)}
                                onChange={(e) =>
                                  handleCurrencySelect(e.target.value)
                                }
                              />
                              {currency}
                            </label>
                          ))}
                      </div>
                    )}
                  </div>
                </th>

                <th className="border border-gray-200 px-4 py-2 min-w-60 font-semibold rounded-lg relative">
                  <div className="flex justify-center items-center">
                    Fee
                    <span
                      className="pl-1 h-5 w-5 text-gray-300 cursor-pointer mt-1"
                      onMouseEnter={() => setShowFeeInfo(true)}
                      onMouseLeave={() => setShowFeeInfo(false)}
                    >
                      <svg
                        enable-background="new 0 0 48 48"
                        height={24}
                        id="Layer_3"
                        version="1.1"
                        viewBox="0 0 48 48"
                        width={24}
                        className="h-4 w-4 "
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M24,48c13.255,0,24-10.745,24-24S37.255,0,24,0S0,10.745,0,24S10.745,48,24,48z M22,36.5V19.438h4V36.5H22z   M24,11.5c1.106,0,2,0.896,2,2s-0.895,2-2,2c-1.103,0-2-0.896-2-2S22.896,11.5,24,11.5z"
                          fill="#ffffff"
                        />
                      </svg>
                    </span>
                    {showFeeInfo && (
                      <div className="absolute bg-gray-100 border border-gray-200 p-2 rounded shadow z-10 top-3/4 ml-2">
                        <p className="text-sm text-cyan-900 font-normal">
                          Fee refers to the charges or costs associated with
                          using a service or product.
                        </p>
                      </div>
                    )}
                  </div>
                </th>

                <th className="border border-gray-200 px-4 py-2 font-semibold rounded-lg relative">
                  <div className="flex items-center justify-center">
                    Website
                    <span
                      className="pl-1 h-5 w-5 text-gray-300 cursor-pointer mt-1 "
                      onMouseEnter={() => setShowWebsiteInfo(true)}
                      onMouseLeave={() => setShowWebsiteInfo(false)}
                    >
                      <svg
                        enable-background="new 0 0 48 48"
                        height={24}
                        id="Layer_3"
                        version="1.1"
                        viewBox="0 0 48 48"
                        width={24}
                        className="h-4 w-4 "
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M24,48c13.255,0,24-10.745,24-24S37.255,0,24,0S0,10.745,0,24S10.745,48,24,48z M22,36.5V19.438h4V36.5H22z   M24,11.5c1.106,0,2,0.896,2,2s-0.895,2-2,2c-1.103,0-2-0.896-2-2S22.896,11.5,24,11.5z"
                          fill="#ffffff"
                        />
                      </svg>
                    </span>
                    {showWebsiteInfo && (
                      <div className="absolute bg-gray-100 border border-gray-200 p-2 rounded shadow z-10 top-3/4 ml-2">
                        <p className="text-sm text-cyan-900 font-normal">
                          Website refers to the online platform or web address
                          associated with a service or organization.
                        </p>
                      </div>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="rounded-lg">
              {(searchTerm === "" &&
              selectedMethods.length === 0 &&
              selectedLanguages.length === 0 &&
              selectedSecurityOptions.length === 0 &&
              selectedCountries.length === 0 &&
              selectedCurrencies.length === 0
                ? response["Payment Gateways"]
                : searchTerm === ""
                ? filterTableData(response["Payment Gateways"])
                : filteredGateways
              ).map((gateway, index1) => (
                <tr
                  key={gateway.id}
                  className={`border-b border-gray-200 rounded-lg ${
                    index1 % 2 === 0 ? "" : "bg-gray-50"
                  }`}
                >
                  <td className="border border-gray-200 px-4 py-2 rounded-lg">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                      checked={checkedBoxes[gateway.id] || false}
                      onChange={() => handleCheckboxChange(gateway.id, gateway)}
                    />
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-cyan-900">
                    {gateway["Payment Gateway Name"]}
                  </td>
                  <td className="border border-gray-200 px-4 py-5 relative">
                    {Array.isArray(gateway["Payment Methods"]) ? (
                      <>
                        {gateway["Payment Methods"]
                          .slice(0, 3)
                          .map((method, index) => (
                            <span
                              key={index}
                              className={`border bg-gray-100 shadow-md shadow-gray-200 ${
                                index1 % 2 === 0 ? "" : "bg-white"
                              } text-cyan-900 mr-2 mb-2 px-2 py-1 rounded-md inline-block`}
                            >
                              <span className="flex">
                                <PaymentIcon
                                  id={method.toLowerCase()}
                                  style={{}}
                                  className="payment-icon h-6 w-6 mr-1"
                                />
                                {method}
                              </span>
                            </span>
                          ))}

                        {showAll &&
                          gateway["Payment Methods"]
                            .slice(3)
                            .map((method, index) => (
                              <span
                                key={index}
                                className={`border bg-gray-100 shadow-md shadow-gray-200 ${
                                  index1 % 2 === 0 ? "" : "bg-white"
                                } text-cyan-900 mr-2 mb-2 px-2 py-1 rounded-md inline-block`}
                              >
                                <span className="flex">
                                  <PaymentIcon
                                    id={method.toLowerCase()}
                                    style={{}}
                                    className="payment-icon h-6 w-6 mr-1"
                                  />
                                  {method}
                                </span>
                              </span>
                            ))}
                        {!showAll && gateway["Payment Methods"].length > 3 && (
                          <span
                            onClick={toggleShowAll}
                            className="text-cyan-300 absolute right-0 bottom-0 mr-2 mb-2 px-2 py-1 rounded-md cursor-pointer"
                          >
                            more...
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="payment-method">
                        {gateway["Payment Methods"]}
                      </span>
                    )}
                  </td>

                  <td className="border border-gray-200 px-4 py-2 relative">
                    {Array.isArray(gateway["API Languages"]) ? (
                      <>
                        {!showLanguages ? (
                          <>
                            {gateway["API Languages"]
                              .slice(0, 3)
                              .map((language, index) => (
                                <span
                                  key={index}
                                  className={`border bg-gray-100 shadow-md shadow-gray-200 ${
                                    index1 % 2 === 0 ? "" : "bg-white"
                                  } text-cyan-900 mr-2 mb-2 px-2 py-1 rounded-md inline-block`}
                                >
                                  {language}
                                </span>
                              ))}

                            {gateway["API Languages"].length > 3 && (
                              <span
                                onClick={toggleShowLanguages}
                                className="text-cyan-300 absolute right-0 bottom-0 mr-2 mb-2 px-2 py-1 rounded-md cursor-pointer"
                              >
                                more...
                              </span>
                            )}
                          </>
                        ) : (
                          gateway["API Languages"].map((language, index) => (
                            <span
                              key={index}
                              className={`border bg-gray-100 shadow-md shadow-gray-200 ${
                                index1 % 2 === 0 ? "" : "bg-white"
                              } text-cyan-900 mr-2 mb-2 px-2 py-1 rounded-md inline-block`}
                            >
                              {language}
                            </span>
                          ))
                        )}
                      </>
                    ) : (
                      <span className="api-language">
                        {gateway["API Languages"]}
                      </span>
                    )}
                  </td>

                  <td className="border border-gray-200 px-4 py-2 text-cyan-900">
                    {Array.isArray(gateway["Security/Compliance"])
                      ? gateway["Security/Compliance"].join(", ")
                      : gateway["Security/Compliance"]}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 relative">
                    {Array.isArray(gateway.Countries) ? (
                      <>
                        {!showCountries ? (
                          <>
                            {gateway.Countries.slice(0, 3).map(
                              (country, index) => (
                                <span
                                  key={index}
                                  className={`border bg-gray-100 shadow-md shadow-gray-200 ${
                                    index1 % 2 === 0 ? "" : "bg-white"
                                  } text-cyan-900 mr-2 mb-2 px-2 py-1 rounded-md inline-block`}
                                >
                                  <span
                                    className={`ml-1 mr-1 h-4 w-4 flag-icon flag-icon-${countryToAlpha2(
                                      country
                                    ).toLowerCase()}`}
                                  ></span>
                                  {country}
                                </span>
                              )
                            )}
                            {gateway.Countries.length > 3 && (
                              <span
                                onClick={toggleShowCountries}
                                className="text-cyan-300 absolute right-0 bottom-0 mr-2 mb-2 px-2 py-1 rounded-md cursor-pointer"
                              >
                                more...
                              </span>
                            )}
                          </>
                        ) : (
                          gateway.Countries.map((country, index) => (
                            <span
                              key={index}
                              className={`border bg-gray-100 shadow-md shadow-gray-200 ${
                                index1 % 2 === 0 ? "" : "bg-white"
                              } text-cyan-900 mr-2 mb-2 px-2 py-1 rounded-md inline-block`}
                            >
                              <span
                                className={`ml-1 mr-1 h-4 w-4 flag-icon flag-icon-${countryToAlpha2(
                                  country
                                ).toLowerCase()}`}
                              ></span>
                              {country}
                            </span>
                          ))
                        )}
                      </>
                    ) : (
                      <span className="api-country">{gateway.Countries}</span>
                    )}
                  </td>

                  <td className="border border-gray-200 px-4 py-2 relative">
                    {Array.isArray(gateway.Currencies) ? (
                      <>
                        {!showCurrencies ? (
                          <>
                            {gateway.Currencies.slice(0, 3).map(
                              (currency, index) => (
                                <span
                                  key={index}
                                  className={`border bg-gray-100 shadow-md shadow-gray-200 ${
                                    index1 % 2 === 0 ? "" : "bg-white"
                                  } text-cyan-900 mr-2 mb-2 px-2 py-1 rounded-md inline-block`}
                                >
                                  <span className="pr-1">
                                    {getSymbolFromCurrency(currency)}
                                  </span>
                                  {currency}
                                </span>
                              )
                            )}
                            {gateway.Currencies.length > 3 && (
                              <span
                                onClick={toggleShowCurrencies}
                                className="text-cyan-300 mr-2 mb-2 px-2 py-1 absolute right-0 bottom-0 rounded-md inline-block cursor-pointer"
                              >
                                more...
                              </span>
                            )}
                          </>
                        ) : (
                          gateway.Currencies.map((currency, index) => (
                            <span
                              key={index}
                              className={`border bg-gray-100 shadow-md shadow-gray-200 ${
                                index1 % 2 === 0 ? "" : "bg-white"
                              } text-cyan-900 mr-2 mb-2 px-2 py-1 rounded-md inline-block`}
                            >
                              <span className="pr-1">
                                {getSymbolFromCurrency(currency)}
                              </span>
                              {currency}
                            </span>
                          ))
                        )}
                      </>
                    ) : (
                      <span className="currency">{gateway.Currencies}</span>
                    )}
                  </td>

                  <td className="border border-gray-200 px-4 py-2 text-cyan-900">
                    {Array.isArray(gateway.Fee)
                      ? gateway.Fee.join(", ")
                      : gateway.Fee}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-cyan-900">
                    <a href={gateway.Website}>
                      {gateway["Payment Gateway Name"]}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isPGPopupVisible && (
          <PaymentGatewayPopup
            finalCompareResponse={finalCompareResponse}
            selectedGateways={selectedGateways}
          />
        )}
      </div>
    );
  }

  function POSoutput({ responseText }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [checkedCount, setCheckedCount] = useState(0);
    const [checkedBoxes, setCheckedBoxes] = useState({});
    let filteredPOS = [];

    const [isLoading, setIsLoading] = useState(false);

    let response;

    useEffect(() => {
      if (response && response.POS) {
        const initialCheckedBoxes = {};
        response.POS.forEach((pos, index) => {
          initialCheckedBoxes[index] = false;
        });
        setCheckedBoxes(initialCheckedBoxes);
      }
    }, [response]);

    const handleCheckboxChange = (id, posData) => {
      const newCheckedBoxes = { ...checkedBoxes };
      newCheckedBoxes[id] = !newCheckedBoxes[id];
      setCheckedBoxes(newCheckedBoxes);

      const isChecked = newCheckedBoxes[id];
      setCheckedCount((prevCount) =>
        isChecked ? prevCount + 1 : prevCount - 1
      );

      const sessionStorageKey = `checkbox_${id}`;
      if (isChecked) {
        sessionStorage.setItem(sessionStorageKey, JSON.stringify({ posData }));
      } else {
        sessionStorage.removeItem(sessionStorageKey);
      }
    };

    const handleCompareClick = async () => {
      try {
        // Set isLoading to true to indicate loading state
        setIsLoading(true);

        function retrieveCheckboxSessionStorageItems() {
          const items = {};

          // Loop through sessionStorage keys
          for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);

            // Check if key starts with "checkbox_"
            if (key.startsWith("checkbox_")) {
              // Retrieve the item from sessionStorage
              const item = sessionStorage.getItem(key);

              // Parse the item value from JSON
              const parsedItem = JSON.parse(item);

              // Add the item to the result object
              items[key] = parsedItem;
            }
          }

          return items;
        }

        const checkboxItems = retrieveCheckboxSessionStorageItems();
        const checkboxItemsJson = JSON.stringify(checkboxItems);

        let currencyVal = sessionStorage.getItem("currency");
        if (!currencyVal) {
          currencyVal = null;
        }

        let countryVal = sessionStorage.getItem("country");
        if (!countryVal) {
          countryVal = null;
        }

        let inputVal = inputText;
        if (!inputText) {
          inputVal = null;
        }

        const compareResponse = await fetch(
          `https://ut4vfwn4rrk53nl36ymmnv3xem0iezgi.lambda-url.us-east-1.on.aws/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              checkboxItems: checkboxItemsJson,
              country: countryVal,
              currency: currencyVal,
              userinput: inputVal,
            }),
          }
        );

        if (!compareResponse.ok) {
          console.log("error receiving response");
          throw new Error("Failed to fetch data");
        }

        const compareResponseData = await compareResponse.json();
        const finalCompareResponse = compareResponseData.bot.trim();
        console.log(finalCompareResponse);

        const paragraphs = finalCompareResponse
          .split("\n")
          .map((paragraph, index) => (
            <p key={index}>
              <br></br>
              {paragraph}
            </p>
          ));

        const selectedPOS = Object.values(checkboxItems);

        setSelectedPOS(selectedPOS);
        // Set finalCompareResponse state
        setFinalCompareResponsePOS(paragraphs);
        // Set finalCompareResponse state
        // setFinalCompareResponse(finalCompareResponse);

        // Set isLoading to false to indicate end of loading state
        setIsLoading(false);

        // Show the popup
        setIsPOSPopupVisible(true);
      } catch (error) {
        console.error("Error occurred:", error);
        setIsLoading(false); // Ensure isLoading is set to false in case of errors
      }
    };

    try {
      response = JSON.parse(responseText);

      response.POS.forEach((pos, index) => {
        pos.id = index;
      });

      filteredPOS = response.POS.filter((pos) => {
        const posValues = Object.values(pos);
        for (const value of posValues) {
          if (
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            return true;
          }
          if (Array.isArray(value)) {
            for (const item of value) {
              if (
                typeof item === "string" &&
                item.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                return true;
              }
            }
          }
        }
        return false;
      });
    } catch (error) {
      return <p>Error: {error.message}</p>;
    }

    return (
      <div className="flex flex-col">
        <div className="min-w-1/2 md:w-1/2 m-4">
          <form className="flex items-center">
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-300 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="simple-search"
                className="bg-gray-100 border min-w-72 border-gray-200 text-gray-900 text-sm rounded-lg focus:outline-none block w-full pl-10 p-2 dark:placeholder-gray-400 dark:text-black"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-center ml-2 mb-2">
              <button
                className={`bg-cyan-500 text-white px-4 py-2 w-40 mt-2 rounded-lg focus:outline-none relative ${
                  isLoading ? "opacity-50 pointer-events-none" : ""
                } ${checkedCount < 2 ? "opacity-50 pointer-events-none" : ""}`}
                onClick={!isLoading ? handleCompareClick : undefined}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className=" flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
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
                ) : (
                  `Compare(${checkedCount})`
                )}
              </button>
            </div>

            <div className="ml-2">
              <button
                type="button"
                className="mt-2 px-4 py-2 mb-2 text-white rounded-md transition-colors w-full bg-cyan-500 min-w-60"
                onClick={handleScheduleSubmit}
              >
                {/* I need consultation 🡢 */}
                {buttonText ? buttonText : "I need consultation 🡢"}
              </button>
            </div>
          </form>
        </div>
        <div className="overflow-x-auto max-h-96 overflow-y-auto custom-scrollbar">
          <table className="border border-gray-200">
            <thead className=" bg-cyan-500 text-white ">
              <tr>
                <th className="border border-gray-200 px-4 py-2 font-semibold">
                  Select
                </th>
                <th className="border border-gray-200 px-4 py-2 font-semibold">
                  POS Name
                </th>
                <th className="border border-gray-200 px-4 py-2 font-semibold min-w-60 pt-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Reviews</span>
                    <div className="flex flex-row border-t border-gray-200 mt-1 pt-1">
                      <span className="flex-1 text-xs font-normal text-center">
                        Google Reviews
                      </span>
                      <span className="flex-1 text-xs font-normal text-center border-l border-gray-200">
                        Trust Pilot Reviews
                      </span>
                    </div>
                  </div>
                </th>

                <th className="border border-gray-200 px-4 py-2  font-semibold min-w-52">
                  Device Cost
                </th>
                <th className="border border-gray-200 px-4 py-2   font-semibold min-w-48">
                  Works with (Payment Gateway)
                </th>
                <th className="border border-gray-200 px-4 py-2  font-semibold min-w-40">
                  Payment processing cost
                </th>
                <th className="border border-gray-200 px-4 py-2  font-semibold">
                  Industries
                </th>
                {/* <th className="border border-gray-200 px-4 py-2 text-black bg-gray-300 font-semibold">
                Inventory Management
              </th> */}
              </tr>
            </thead>
            <tbody>
              {(searchTerm === "" ? response.POS : filteredPOS).map(
                (pos, index) => (
                  <tr
                    key={pos.id}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? "" : "bg-cyan-50"
                    }`}
                  >
                    <td className="border border-gray-200 px-4 py-2">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500 checked:bg-cyan-500"
                        checked={checkedBoxes[pos.id] || false}
                        onChange={() => handleCheckboxChange(pos.id, pos)}
                      />
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {pos["POS Name"] || "-"}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <div className="flex flex-row">
                        <span className="flex-1 text-sm font-normal text-center">
                          {pos["Google Reviews"] || "-"}
                        </span>
                        <span className="flex-1 text-sm font-normal text-center border-l border-gray-200">
                          {pos["Trust Pilot Reviews"] || "-"}
                        </span>
                      </div>
                    </td>

                    <td className="border border-gray-200 px-4 py-2">
                      {pos["Device Cost"] || "-"}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {pos["Works with (Payment Gateway)"] || "-"}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {pos["Payment processing cost"] || "-"}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {pos["Industries"] || "-"}
                    </td>
                    {/* <td className="border border-gray-200 px-4 py-2">
                    {pos["Inventory Management"] || "-"}
                  </td> */}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {isPOSPopupVisible && (
          <POSPopup
            finalCompareResponsePOS={finalCompareResponsePOS}
            selectedPOS={selectedPOS}
          />
        )}
      </div>
    );
  }

  return (
    <body>
      <main className="flex flex-col min-h-screen items-center justify-center p-8 sm:p-16 md:p-24 lg:p-32 xl:p-40">
        <div className="flex flex-col items-start justify-center w-3/4 max-w-full rounded-xl p-4">
          <div className="flex items-center justify-end w-full mb-1 gap-2">
            <input
              type="checkbox"
              id="consultationCheckbox"
              onChange={handleConsultationChange}
              checked={consultationNeeded}
              className="bg h-4 w-4 border border-gray-400 rounded checked:bg-black checked:border-transparent focus:outline-none focus:bg-black"
            />
            <label
              htmlFor="consultationCheckbox"
              className="text-cyan-900 font-semibold text-sm"
            >
              I need consultation
            </label>
          </div>
          <div className="flex justify-between w-full mb-4 mt-2">
            <div className="flex justify-between w-full">
              <label className="flex cursor-pointer select-none items-center ml-2 mr-2">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleToggle}
                    className="sr-only"
                  />
                  <div className=" h-10 w-52 rounded-full bg-cyan-500 shadow-md shadow-gray-400 flex justify-between items-center px-4">
                    <span className="text-white font-semibold pl-6">
                      {isChecked ? "POS" : "Payment Gateway"}
                    </span>
                    <div
                      className={`dot absolute h-8 w-8 rounded-full transition ${
                        isChecked
                          ? " bg-white top-1 right-1"
                          : "bg-white top-1 left-1"
                      }`}
                    ></div>
                  </div>
                </div>
              </label>

              <div className="w-3/4 flex items-center">
                <div className="flex ml-2 w-3/4 gap-2">
                  <select
                    className="rounded-xl w-full shadow-md shadow-gray-400 h-10 text-sm pl-2 text-gray-400 cursor-pointer border-none focus:outline-none"
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
                <div className="flex gap-2 w-3/4 ml-2">
                  <select
                    id="currencyDropdown"
                    className="rounded-xl shadow-md shadow-gray-400 w-full h-10 text-sm pl-2 text-gray-400 border-none cursor-pointer focus:outline-none"
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
                </div>
              </div>
            </div>
          </div>

          <div className="w-full mb-4 text-black rounded-md relative mt-4 flex">
            <div className="relative w-full">
              <input
                type="text"
                id="floating_outlined"
                className="block px-2.5 pb-2.5 pt-4 w-full shadow-md shadow-gray-400 h-20 text-sm text-black bg-white rounded-2xl border border-gray-300 dark:text-black dark:border-gray-200 dark:focus:border-gray-400 focus:outline-none focus:ring- focus:border-gray-400 peer"
                placeholder=" "
                onChange={handleInputChange}
              />
              <label
                htmlFor="floating_outlined"
                className="absolute text-md pb-1 rounded-md text-gray-500 bg-white dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]  px-2 peer-focus:px-2 peer-focus:text-gray-500 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Requirements
              </label>
            </div>
            <button
              type="button"
              className={` mb-2 ml-2 h-20 text-white transition-colors min-w-20 rounded-2xl shadow-md shadow-cyan-600
                ${
                  isButtonDisabled
                    ? " bg-cyan-500 bg-opacity-55 cursor-not-allowed"
                    : "hover:border-gray-300 bg-cyan-500 hover:bg-cyan-400 cursor-pointer"
                }`}
              onClick={handleButtonClick}
              disabled={isButtonDisabled}
            >
              {isLoading && (
                <div className="flex justify-center items-center">
                  <svg className="animate-spin h-5 w-5 " viewBox="0 0 24 24">
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
              {!isLoading && "🡢"}
            </button>
          </div>
        </div>

        {/* <div className="justify-center w-full max-w-96">
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
        </div> */}

        {/* <div className="justify-center w-full max-w-96">
          <div className="mt-16 text-center font-medium font-mono">
            {isLoading && <LoaderWithFacts setIsLoading={setIsLoading} />}
          </div>
        </div> */}

        {isPopupVisible && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4`}
          >
            <div
              className={`bg-white rounded-lg shadow-md ${
                isFullScreen
                  ? "w-screen h-screen"
                  : "max-w-4xl w-auto max-h-3/4 min-h-20"
              } overflow-hidden relative text-black custom-scrollbar`}
            >
              <button
                className={`text-gray-600 hover:text-gray-800 ${
                  isFullScreen
                    ? "absolute top-3.5 right-20"
                    : "absolute top-4 right-16"
                }`}
                onClick={handleResizePopup}
              >
                {isFullScreen ? (
                  <svg
                    class="feather feather-minimize-2"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                  >
                    <polyline points="4 14 10 14 10 20" />
                    <polyline points="20 10 14 10 14 4" />
                    <line x1="14" x2="21" y1="10" y2="3" />
                    <line x1="3" x2="10" y1="21" y2="14" />
                  </svg>
                ) : (
                  <svg
                    fill="none"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                    className="pt-2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.8995 4.10052V2.10052H21.8995V10.1005H19.8995V5.51477L14.1213 11.293L12.7071 9.87878L18.4854 4.10052H13.8995Z"
                      fill="currentColor"
                    />
                    <path
                      d="M4.10046 13.8995H2.10046V21.8995H10.1005V19.8995H5.51468L11.2929 14.1212L9.87872 12.707L4.10046 18.4853V13.8995Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </button>
              <button
                className={`text-gray-600 hover:text-gray-800 ${
                  isFullScreen
                    ? "absolute top-2 right-10"
                    : "absolute top-4 right-8"
                }`}
                onClick={handleClosePopup}
              >
                <svg
                  className="h-8 w-8 p-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="p-1">
                {product === "pos" ? (
                  <POSoutput responseText={responseText} />
                ) : product === "payment gateway" ? (
                  <PaymentGateways responseText={responseText} />
                ) : null}
              </div>
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
              <div className="p-4">
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
