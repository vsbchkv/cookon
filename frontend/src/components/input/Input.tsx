import clsx from 'clsx';

import './Input.css';
import React, { useState, InputHTMLAttributes, SetStateAction } from 'react';

type InputTypes = 'number' | 'text';

type InputProps = {
  type: InputTypes;
  onChange?: (value: string | number) => SetStateAction<string | number> | void;
} & InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({ type, onChange, value, ...inputProps }) => {
  const handleCallback = <T extends string | number>(value: T) => {
    return onChange && onChange(value);
  };

  if (type === 'number') {
    const [quantity, setQuantity] = useState(type === 'number' && value !== undefined ? value : 0);
    const adjustQuantity = (dir: boolean) => {
      const newQuantity = dir ? +quantity + 1 : +quantity - 1;

      if ((inputProps.max && newQuantity > +inputProps.max) || (inputProps.min && newQuantity < +inputProps.min)) {
        return;
      }

      setQuantity(newQuantity);
      if (onChange) {
        handleCallback(newQuantity);
      }
    };
    return (
      <>
        <button
          type='button'
          className='input-button input-button--decrease'
          onClick={() => adjustQuantity(false)}
          aria-label='decrease'
        >
          -
        </button>
        <input
          type={type}
          className={clsx('input', 'input--number')}
          onChange={(e) => {
            const { value } = e.target;
            if (value) {
              setQuantity(+value);
              handleCallback(+value);
            }
          }}
          value={quantity}
          style={{ ['--w' as keyof React.CSSProperties]: `${String(quantity).length}` }}
          {...inputProps}
        />
        <button
          type='button'
          className='input-button input-button--increase'
          onClick={() => adjustQuantity(true)}
          aria-label='increase'
        >
          +
        </button>
      </>
    );
  }
};

export { Input };
