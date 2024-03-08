import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
// import { useRouter } from 'next/router';

const ContactForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleChange = (value, country, event, formattedValue) => {
    setContactNumber(value);
    setCountryCode(country.countryCode);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsButtonDisabled(true);

    try {
      const response = await fetch(
        "https://natd5t4ljnca5eq3pv5zidzxdy0ccyuh.lambda-url.us-east-1.on.aws/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            countryCode,
            contactNumber,
            email,
            comments,
          }),
        }
      );

      if (response.ok) {
        console.log("Form data saved successfully!");

        window.alert("Form submitted successfully!");
        setFirstName("");
        setLastName("");
        setCountryCode("");
        setContactNumber("");
        setEmail("");
        setComments("");

        // Redirect to another page after successful submission
        // router.push('/');
      } else {
        // Handle error cases, if needed
        console.error("Failed to save form data");
      }
      setTimeout(() => {
        setIsButtonDisabled(false); // Re-enable the submit button
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setIsButtonDisabled(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded px-8 pt-8 pb-6 mb-8 gap-6"
    >
      <div className="flex flex-wrap mb-4">
        <div className="mt-2 w-1/2 pr-2">
          <label
            htmlFor="firstName"
            className="block mb-1 text-sm font-semibold text-black"
          >
            First name
          </label>
          <input
            type="text"
            id="firstName"
            className="mt-1 p-3 w-full border border-gray-500 rounded-md text-sm focus:outline-none"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="mt-2 w-full md:w-1/2 pl-2">
          <label
            htmlFor="lastName"
            className="block mb-1 text-sm font-semibold text-black"
          >
            Last name
          </label>
          <input
            type="text"
            id="lastName"
            className="mt-1 p-3 w-full border border-gray-500 rounded-md text-sm focus:outline-none"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="mb-4 flex flex-wrap">
        <div className="mt-2 w-full md:w-1/2 sm:w-1/2 pr-2">
          <label
            htmlFor="email"
            className="block mb-1 text-sm font-semibold text-black"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 p-3 w-full border border-gray-500 rounded-md text-sm focus:outline-none"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mt-2 w-full md:w-1/2 sm:w-1/2 pl-2">
          <div className="pl-8">
            <label
              htmlFor="contactNumber"
              className="block mb-1 text-sm font-semibold text-black"
            >
              Phone
            </label>
            <PhoneInput
              inputProps={{
                name: "phone",
                required: true,
                autoFocus: true,
                className:
                  "p-3 pl-5 w-full border border-gray-500 rounded-md text-sm focus:outline-none",
                placeholder: "Phone number",
              }}
              // inputStyle={{paddingLeft:'42px'}}
              inputStyle={{ paddingLeft: "76px" }}
              containerStyle={{ borderRadius: "12px" }}
              buttonStyle={{
                paddingRight: "20px",
                paddingLeft: "10px",
                backgroundColor: "white",
                borderRadius: "6px",
                borderColor: "lightgray",
              }}
              value={contactNumber}
              onChange={handleChange}
              containerClass="mt-2 relative pr-8 rounded-lg"
              dropdownClass="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg"
              searchClass="py-1 px-2 border-b border-gray-200 focus:outline-none"
            />
          </div>
        </div>
      </div>
      <div className="mt-2 mb-4 w-full">
        <label
          htmlFor="comments"
          className="mb-1 text-sm font-semibold text-black flex"
        >
          Additional comments <p className="text-gray-400 ml-2">(optional)</p>
        </label>
        <textarea
          id="comments"
          className="mt-1 p-3 w-full text-sm resize-none border border-gray-500 rounded-md focus:outline-none"
          placeholder="Write here.."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={4}
        />
      </div>
      <div className="flex justify-end gap-2 items-center">
        <a href="https://crabroom.com/hr-interview" target="_blank"><p className="underline text-gray-400 hover:text-black mr-2">Schedule a call</p></a>
        <button
          type="submit"
          className={` px-4 py-2 text-white text-sm rounded-md transition-colors ${
            isButtonDisabled
              ? "bg-cyan-500 bg-opacity-55 cursor-not-allowed"
              : "hover:border-gray-300 bg-cyan-500 hover:bg-cyan-400 cursor-pointer"
          }`}
          onClick={handleSubmit}
          disabled={isButtonDisabled}
        >
          Submit 🡢
        </button>
        {/* <p className="text-gray-400 justify-center">(or)</p> */}
        {/* <button
          type="submit"
          className="mt-2 px-4 py-2 text-white text-sm rounded-md transition-colors bg-indigo-500 hover:bg-blue-500"
          onClick={handleScheduleSubmit}
        >
          Schedule a call 🡢
        </button> */}
      </div>
      {/* <form
      onSubmit={handleSubmit}
      className="bg-white md:hidden rounded px-4 pt-8 pb-6 mb-8 gap-6 md:px-8"
    >
      <div className="flex flex-wrap mb-4">
        <div className="mt-2 w-full">
          <label
            htmlFor="firstName"
            className="block mb-1 text-sm font-semibold text-black"
          >
            First name
          </label>
          <input
            type="text"
            id="firstName"
            className="mt-1 p-3 w-full border border-gray-500 rounded-md text-sm focus:outline-none"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="flex flex-wrap mb-4">
        <div className="mt-2 w-full">
          <label
            htmlFor="lastName"
            className="block mb-1 text-sm font-semibold text-black"
          >
            Last name
          </label>
          <input
            type="text"
            id="lastName"
            className="mt-1 p-3 w-full border border-gray-500 rounded-md text-sm focus:outline-none"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="flex flex-wrap mb-4">
        <div className="mt-2 w-full">
          <label
            htmlFor="email"
            className="block mb-1 text-sm font-semibold text-black"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 p-3 w-full border border-gray-500 rounded-md text-sm focus:outline-none"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="flex flex-wrap mb-4">
        <div className="mt-2 w-full">
          <label
            htmlFor="contactNumber"
            className="block mb-1 text-sm font-semibold text-black"
          >
            Phone
          </label>
          <PhoneInput
            inputProps={{
              name: "phone",
              required: true,
              autoFocus: true,
              className:
                "p-3 w-full border border-gray-500 rounded-md text-sm focus:outline-none",
              placeholder: "Phone number",
            }}
            inputStyle={{ paddingLeft: "76px" }}
            containerStyle={{ borderRadius: "12px" }}
            buttonStyle={{
              paddingRight: "20px",
              paddingLeft: "10px",
              backgroundColor: "white",
              borderRadius: "6px",
              borderColor: "lightgray",
            }}
            value={contactNumber}
            onChange={handleChange}
            containerClass="mt-2 relative pr-8 rounded-lg"
            dropdownClass="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg"
            searchClass="py-1 px-2 border-b border-gray-200 focus:outline-none"
          />
        </div>
      </div>
      <div className="mt-2 mb-4 w-full">
        <label
          htmlFor="comments"
          className="mb-1 text-sm font-semibold text-black flex"
        >
          Additional comments <p className="text-gray-400 ml-2">(optional)</p>
        </label>
        <textarea
          id="comments"
          className="mt-1 p-3 w-full text-sm resize-none border border-gray-500 rounded-md focus:outline-none"
          placeholder="Write here.."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={4}
        />
      </div>
      <div className="flex justify-end gap-2 items-center">
        <button
          type="submit"
          className={`mt-2 px-4 py-2 text-white text-sm rounded-md transition-colors ${
            isButtonDisabled
              ? "bg-indigo-500 bg-opacity-55 cursor-not-allowed"
              : "hover:border-gray-300 bg-indigo-500 hover:bg-blue-500 cursor-pointer"
          }`}
          onClick={handleSubmit}
          disabled={isButtonDisabled}
        >
          Submit 🡢
        </button>
        <p className="text-gray-400 justify-center">(or)</p>
        <button
          type="submit"
          className="mt-2 px-4 py-2 text-white text-sm rounded-md transition-colors bg-indigo-500 hover:bg-blue-500"
          onClick={handleScheduleSubmit}
        >
          Schedule a call 🡢
        </button>
      </div>
    </form> */}
    </form>
  );
};

export default ContactForm;
