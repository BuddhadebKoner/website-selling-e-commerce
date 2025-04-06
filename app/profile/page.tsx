"use client";

import { useUserAuthentication } from '@/context/AuthProvider';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Package, UserCircle, Mail, CheckCircle, LoaderCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";
import ProfileCartActivity from '@/components/ProfileCartActivity';

const Profile = () => {
   const [image, setImage] = useState<File | null>(null);
   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
   const [isUploading, setIsUploading] = useState(false);
   const [uploadError, setUploadError] = useState<string | null>(null);
   const [uploadSuccess, setUploadSuccess] = useState(false);

   const { user } = useUser();
   const { currentUser, isLoading } = useUserAuthentication();
   const router = useRouter();

   // Handle file selection
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadError(null);
      setUploadSuccess(false);
      setImage(file);

      // Create preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
         setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
   };

   // Handle profile image upload
   const handleProfileChange = async () => {
      if (!image || !user) return;

      try {
         setIsUploading(true);
         setUploadError(null);

         // Upload image using Clerk's client-side method
         await user.setProfileImage({ file: image });

         // Refresh user to get updated image
         await user.reload();

         setUploadSuccess(true);
         setImage(null); // Clear selected file

         // Clear success message after 3 seconds
         setTimeout(() => setUploadSuccess(false), 3000);
      } catch (error) {
         console.error('Error uploading profile image:', error);
         setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
      } finally {
         setIsUploading(false);
      }
   };

   // Redirect if not logged in
   useEffect(() => {
      if (!isLoading && !currentUser) {
         router.push('/sign-in');
      }
   }, [isLoading, currentUser, router]);

   // Clear preview when component unmounts
   useEffect(() => {
      return () => {
         if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
         }
      };
   }, [previewUrl]);

   // Loading state
   if (isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <LoaderCircle className='animate-spin w-12 h-12 text-primary' />
         </div>
      );
   }

   if (!currentUser) {
      return null;
   }

   console.log("current user : ", currentUser.cart?.products)

   return (
      <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
         <div className="w-full max-w-4xl">
            {/* Profile header */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
               {/* Avatar section */}
               <div className="flex flex-col items-center">
                  <div className="relative">
                     {previewUrl ? (
                        <Image
                           src={previewUrl}
                           alt="Profile preview"
                           width={180}
                           height={180}
                           className="rounded-lg border-4 border-theme object-cover"
                        />
                     ) : currentUser.imageUrl ? (
                        <>
                           <label htmlFor="profile-image" className="rounded-lg object-cover">
                              <Image
                                 src={currentUser.imageUrl}
                                 alt={currentUser.fullName}
                                 width={180}
                                 height={180}
                                 className='rounded-lg border-4 border-theme object-cover'
                              />
                           </label>
                        </>
                     ) : (
                        <div className="w-[180px] h-[180px] bg-background-secondary rounded-lg border-4 border-theme flex items-center justify-center">
                           <UserCircle className="w-24 h-24 text-secondary" />
                        </div>
                     )}

                     {isUploading && (
                        <div className="absolute inset-0 bg-background/75 rounded-lg flex items-center justify-center">
                           <LoaderCircle className="animate-spin w-10 h-10 text-primary" />
                        </div>
                     )}
                  </div>

                  {/* Upload section */}
                  <div className="flex flex-col items-center mt-4 w-full">
                     <input
                        type="file"
                        id="profile-image"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                     />

                     {image && (
                        <button
                           onClick={handleProfileChange}
                           disabled={isUploading}
                           className="btn btn-secondary mt-2 w-full"
                        >
                           {isUploading ? 'Uploading...' : 'Update Profile Picture'}
                        </button>
                     )}

                     {uploadError && (
                        <div className="mt-2 flex items-center text-error text-sm">
                           <AlertCircle className="w-4 h-4 mr-1" /> {uploadError}
                        </div>
                     )}

                     {uploadSuccess && (
                        <div className="mt-2 flex items-center text-accent-green text-sm">
                           <CheckCircle className="w-4 h-4 mr-1" /> Profile picture updated successfully!
                        </div>
                     )}
                  </div>
               </div>

               {/* Profile details */}
               <div className="flex-1">
                  <div className="flex items-center">
                     <h1 className="text-3xl font-bold text-primary">{currentUser.fullName}</h1>
                  </div>

                  <div className="flex items-center mt-2 text-secondary">
                     <Mail className="w-4 h-4 mr-2" />
                     <span>{currentUser.email}</span>
                  </div>

                  <div className="mt-6 p-4 bg-box rounded-lg border-theme border">
                     <h2 className="text-xl font-semibold mb-3 text-primary">Account Details</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <p className="text-xs text-secondary mb-1">First Name</p>
                           <p className="text-primary">{currentUser.firstName || 'Not set'}</p>
                        </div>
                        <div>
                           <p className="text-xs text-secondary mb-1">Last Name</p>
                           <p className="text-primary">{currentUser.lastName || 'Not set'}</p>
                        </div>
                        <div>
                           <p className="text-xs text-secondary mb-1">Craeted At</p>
                           <p className="text-primary text-sm font-mono">
                              {currentUser.createdAt && new Date(currentUser.createdAt).toLocaleDateString(
                                 'en-IN',
                                 { year: 'numeric', month: 'long', day: 'numeric' }
                              )}
                           </p>
                        </div>
                        <div>
                           <p className="text-xs text-secondary mb-1">Account Status</p>
                           <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-accent-green mr-1" />
                              <span className="text-primary">Verified</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Cart activity section */}
            <ProfileCartActivity cartProducts={currentUser?.cart?.products} />

            {/* Account options */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
               <Link
                  href="/orders"
                  className="p-4 bg-box rounded-lg border-theme border hover:border-highlight-primary transition-all flex items-center"
               >
                  <Package className="w-6 h-6 mr-3 text-highlight-primary" />
                  <div>
                     <p className="text-primary font-medium">Your Orders</p>
                     <p className="text-secondary text-sm">Track, return, or buy again</p>
                  </div>
               </Link>

               <Link
                  href="/privicy"
                  className="p-4 bg-box rounded-lg border-theme border hover:border-highlight-primary transition-all flex items-center"
               >
                  <ShieldCheck className="w-6 h-6 mr-3 text-highlight-primary" />
                  <div>
                     <p className="text-primary font-medium">Login & Security</p>
                     <p className="text-secondary text-sm">Your Account is manage by clerk safe and secure</p>
                  </div>
               </Link>
            </div>
         </div>
      </div>
   );
};

export default Profile;