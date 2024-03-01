
import React, { useEffect, useState } from 'react';

const LoaderWithFacts = ({ setIsLoading }) => {
  const [facts, setFacts] = useState([
    'Payment gateways are exploring voice-activated payments, leveraging AI assistants like Siri and Alexa to facilitate seamless transactions.',
    'The global payment gateway market is projected to reach $87.6 billion by 2026, with a compound annual growth rate (CAGR) of over 12%.',
    'Cross-border transactions facilitated by payment gateways amounted to over $150 trillion in 2020, highlighting the importance of seamless global payment solutions.',
    'Around 60% of small businesses in the United States utilize online payment gateways, streamlining transactions and enhancing customer experiences.',

  ]);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prevIndex) => (prevIndex + 1) % facts.length);
    }, 3000); // Change the time interval between facts as needed

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [facts]);

  useEffect(() => {
    // Set loading to false after a certain duration (simulating the end of loading)
    // const timeout = setTimeout(() => {
    //   setIsLoading(false);
    // }, 20000); // Adjust the duration as needed

    // // Clean up the timeout on component unmount
    // return () => clearTimeout(timeout);
  }, [setIsLoading]);

  return (
    <div className="loader-with-facts font-mono italic text-lg text-black">
      <p>{facts[currentFactIndex]}</p>
    </div>
  );
};

export default LoaderWithFacts;



