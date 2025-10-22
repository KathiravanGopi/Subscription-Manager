import React, { useRef, useState } from "react";

export default function OtpInput({ length = 6, onComplete, loading = false }) {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  const handleKeyDown = (e) => {
    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    if (e.key === "Delete" || e.key === "Backspace") {
      const index = inputRefs.current.indexOf(e.target);
      const newOtp = [...otp];
      
      if (newOtp[index]) {
        // If current box has value, clear it
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // If current box is empty, go back and clear previous
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleInput = (e) => {
    const { target } = e;
    const index = inputRefs.current.indexOf(target);
    const value = target.value.slice(-1); // Only take the last character
    
    if (value && /^[0-9]$/.test(value)) {
      const newOtp = [
        ...otp.slice(0, index),
        value,
        ...otp.slice(index + 1),
      ];
      setOtp(newOtp);
      
      // Move to next input
      if (index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      } else {
        // If it's the last input, blur it
        target.blur();
      }
      
      // Check if OTP is complete
      if (newOtp.every(digit => digit !== "")) {
        onComplete(newOtp.join(""));
      }
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!new RegExp(`^[0-9]{${otp.length}}$`).test(text)) {
      return;
    }
    const digits = text.split("");
    setOtp(digits);
    
    // Blur all inputs after paste
    inputRefs.current.forEach(input => input?.blur());
    
    // Trigger completion if pasted OTP is complete
    if (digits.every(digit => digit !== "")) {
      onComplete(digits.join(""));
    }
  };

  return (
    <div>
      <form id="otp-form" className="flex gap-2 justify-center">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onPaste={handlePaste}
            disabled={loading}
            ref={(el) => (inputRefs.current[index] = el)}
            className="flex w-12 h-12 sm:w-14 sm:h-14 items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-center text-xl sm:text-2xl font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        ))}
      </form>
      <p className="mt-3 text-sm text-center text-gray-600 dark:text-gray-400">
        Enter the 6-digit code sent to your email
      </p>
    </div>
  );
}
