'use client'

export default function SettingsPage() {
   return (
      <div className="space-y-6 animate-fadeIn">
         <h2 className="text-2xl font-bold">Settings</h2>

         <div className="bg-box rounded-lg border border-theme p-6">
            <h3 className="text-xl font-bold mb-4">General Settings</h3>
            <div className="space-y-4">
               <div className="form-group">
                  <label className="form-label">Store Name</label>
                  <input type="text" className="form-input" defaultValue="Your E-Commerce Store" />
               </div>
               <div className="form-group">
                  <label className="form-label">Store Email</label>
                  <input type="email" className="form-input" defaultValue="contact@yourecommerce.com" />
               </div>
               <div className="form-group">
                  <label className="form-label">Store Currency</label>
                  <select className="form-input">
                     <option>USD ($)</option>
                     <option>EUR (€)</option>
                     <option>GBP (£)</option>
                     <option>JPY (¥)</option>
                     <option>INR (₹)</option>
                  </select>
               </div>
               <div className="form-group">
                  <label className="form-label">Theme</label>
                  <div className="flex space-x-4">
                     <label className="flex items-center">
                        <input type="radio" name="theme" defaultChecked className="mr-2" />
                        <span>Dark</span>
                     </label>
                     <label className="flex items-center">
                        <input type="radio" name="theme" className="mr-2" />
                        <span>Light</span>
                     </label>
                  </div>
               </div>
               <button className="btn btn-primary">Save Changes</button>
            </div>
         </div>
      </div>
   )
}