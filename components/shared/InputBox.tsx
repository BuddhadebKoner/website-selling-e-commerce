import React from 'react'

const InputBox = ({ divClass, htmlFor, lableClass, lableText, isRequired, inputType, inputName, inputValue, handleInputChange, inputClass, inputPlaceholder, Error }: {
   divClass: string,
   htmlFor: string,
   lableClass: string,
   lableText: string,
   isRequired: boolean,
   inputType: string,
   inputName: string,
   inputValue: string,
   handleInputChange: any,
   inputClass: string,
   inputPlaceholder: string,
   Error: string
}) => {
   return (
      <>
         <div className={divClass}>
            <label htmlFor={htmlFor} className={lableClass}>
               {lableText} {isRequired && <span className="text-accent-red">*</span>}
            </label>
            <input
               type={inputType}
               id={htmlFor}
               name={inputName}
               value={inputValue}
               onChange={handleInputChange}
               className={inputClass}
               placeholder={inputPlaceholder}
            />
            {Error && <p className="text-accent-red text-sm mt-1">{Error}</p>}
         </div>
      </>
   )
}

export default InputBox