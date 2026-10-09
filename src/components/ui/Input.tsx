import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  helperText,
  error,
  leftAddon,
  rightAddon,
  className = '',
  id,
  required,
  ...props
}, ref) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {leftAddon && (
          <div className="absolute left-3.5 pointer-events-none text-slate-400 flex items-center justify-center shrink-0 z-10">
            {leftAddon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          className={`w-full h-11 bg-white border ${
            error ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-[#0F2C59]/15 focus:border-[#0F2C59]'
          } rounded-xl ${leftAddon ? 'pl-10' : 'px-3.5'} ${
            rightAddon ? 'pr-10' : 'px-3.5'
          } text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${className}`}
          {...props}
        />
        {rightAddon && (
          <div className="absolute right-3.5 text-slate-400 flex items-center justify-center shrink-0">
            {rightAddon}
          </div>
        )}
      </div>
      {error ? (
        <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500 font-normal">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
