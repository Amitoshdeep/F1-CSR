import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

function SelectField({ label, name, options = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-max">
      <select
        name={name}
        id={name}
        className="commonDropDowns w-full appearance-none"
        onClick={() => setIsOpen(!isOpen)}
        defaultValue=""
      >
        <option value="" disabled hidden>
          {label}
        </option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <IoIosArrowDown
        className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-300
        ${isOpen ? "rotate-180" : ""}`}
      />
    </div>
  );
}

export default SelectField;
