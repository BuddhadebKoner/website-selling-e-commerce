import React from 'react'

const TextAreaBox = ({ divClass, htmlFor, lableClass, inputName, isRequired, inputValue, handleInputChange, inputClass, inputPlaceholder }: {
   divClass: string,
   htmlFor: string,
   inputName: string,
   lableClass: string,
   isRequired: boolean,
   inputValue: string,
   handleInputChange: any,
   inputClass: string,
   inputPlaceholder: string,
}) => {
   return (
      <>
         <div className={divClass}>
            <label htmlFor={htmlFor} className={lableClass}>Product Description
               {isRequired && <span className="text-accent-red">*</span>}
            </label>
            <textarea
               id={htmlFor}
               name={inputName}
               value={inputValue}
               onChange={handleInputChange}
               className={inputClass}
               placeholder={inputPlaceholder}
            />
         </div>
      </>
   )
}

export default TextAreaBox