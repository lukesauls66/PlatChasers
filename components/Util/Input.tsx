"use client";

interface InputProps {
  id: string;
  onChange?: any;
  value?: string;
  label: string;
  type?: string;
}

const Input: React.FC<InputProps> = ({ id, onChange, value, label, type }) => {
  return (
    <div className="relative">
      <input
        onChange={onChange}
        type={type}
        value={value}
        id={id}
        className="block rounded-md px-6 pt-6 pb-1 w-[100%] text-md appearance-none focus:outline-none focus:ring-0 border-[1px] border-black peer"
        placeholder=" "
      />
      <label
        className="absolute text-md text-black duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
