import React from 'react';

interface FormFieldProps {
   fieldType?: 'input' | 'textarea' | 'select';
   divClass?: string;
   htmlFor: string;
   labelClass?: string;
   labelText: string;
   isRequired?: boolean;
   inputType?: string;
   name: string;
   value: any;
   onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
   ) => void;
   inputClass?: string;
   placeholder?: string;
   error?: string;
   options?: { value: string; label: string }[];
}

const FormField: React.FC<FormFieldProps> = ({
   fieldType = 'input',
   divClass = 'form-group',
   htmlFor,
   labelClass = 'form-label',
   labelText,
   isRequired = false,
   inputType = 'text',
   name,
   value,
   onChange,
   inputClass = 'form-input',
   placeholder = '',
   error,
   options,
}) => {
   return (
      <div className={divClass}>
         <label htmlFor={htmlFor} className={labelClass}>
            {labelText} {isRequired && <span className="text-accent-red">*</span>}
         </label>
         {fieldType === 'textarea' ? (
            <textarea
               id={htmlFor}
               name={name}
               value={value}
               onChange={onChange}
               className={inputClass}
               placeholder={placeholder}
            />
         ) : fieldType === 'select' ? (
            <select
               id={htmlFor}
               name={name}
               value={value}
               onChange={onChange}
               className={inputClass}
            >
               {options?.map(opt => (
                  <option key={opt.value} value={opt.value}>
                     {opt.label}
                  </option>
               ))}
            </select>
         ) : (
            <input
               type={inputType}
               id={htmlFor}
               name={name}
               value={value}
               onChange={onChange}
               className={inputClass}
               placeholder={placeholder}
            />
         )}
         {error && <p className="text-accent-red text-sm mt-1">{error}</p>}
      </div>
   );
};

export default FormField;
