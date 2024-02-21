import { useState } from 'react';
// import { useRouter } from 'next/router';

const ContactForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [comments, setComments] = useState('');


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('https://natd5t4ljnca5eq3pv5zidzxdy0ccyuh.lambda-url.us-east-1.on.aws/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    countryCode,
                    contactNumber,
                    email,
                    comments,
                }),
            });

            if (response.ok) {
                // Request was successful
                console.log('Form data saved successfully!');

                window.alert('Form submitted successfully!');
                // Reset the form fields after submission
                setFirstName('');
                setLastName('');
                setCountryCode('');
                setContactNumber('');
                setEmail('');
                setComments('');

                // Redirect to another page after successful submission
                // router.push('/');  

            } else {
                // Handle error cases, if needed
                console.error('Failed to save form data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        
        <form onSubmit={handleSubmit} className="flex-col items-center">
            <div className='flex-row items-center text-center mb-4 text-2xl'>
                <label htmlFor="heading" className="font-semibold">Contact Information</label>
            </div>
            <div>
                <label htmlFor="firstName" className="pr-6 text-sm font-semibold text-black">First Name:</label>
                <input
                    type="text"
                    id="firstName"
                    className="mt-1 p-2 w-80 ring-1 ring-inset ring-lilac rounded-md"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="lastName" className="pr-6 text-sm font-semibold text-gray-700">Last Name:</label>
                <input
                    type="text"
                    id="lastName"
                    className="mt-1 p-2 w-80 ring-1 ring-inset ring-lilac rounded-md"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="contactNumber" className="block text-sm font-semibold text-gray-700">Contact Number:</label>
                <select
                    id="countryCode"
                    className="mt-1 p-2 w-auto ring-1 ring-inset ring-lilac rounded-md"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    required
                >
                    {/* Replace the options with actual country codes */}
                    <option value="">Select Country Code</option>
                    <option value="+1">+1 (USA)</option>
                    <option value="+44">+44 (UK)</option>
                    {/* Add more country codes as needed */}
                </select>
                <input
                    id="contactNumber"
                    type="text"
                    className="mt-1 p-2 w-80 ring-1 ring-inset ring-lilac rounded-md"
                    placeholder="Enter Phone Number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                // Add more attributes or formatting for the phone number input as needed
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email:</label>
                <input
                    type="email"
                    id="email"
                    className="mt-1 p-2 w-80 ring-1 ring-inset ring-lilac rounded-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="comments" className="block text-sm font-semibold text-gray-700">Additional Comments:</label>
                <textarea
                    id="comments"
                    className="mt-1 p-2 w-80 resize-none ring-1 ring-inset ring-lilac rounded-md"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={4}
                />
            </div>
            <div className="flex flex-col">
                <button type="submit" className="flex self-center mt-2 w-auto px-4 py-2 text-white rounded-md transition-colors bg-indigo" >Submit</button>
            </div>
        </form>
    );
};

export default ContactForm;
