/**
 * Formats a date string according to Indian Standard Time
 * @param {string|Date} dateString - The date to format
 * @param {boolean} includeTime - Whether to include time in the formatted string
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString: string | Date, includeTime: boolean = true): string => {
   try {
      const options: Intl.DateTimeFormatOptions = {
         year: 'numeric',
         month: 'short',
         day: 'numeric',
         timeZone: 'Asia/Kolkata' // Indian Standard Time
      };

      // Add time options if includeTime is true
      if (includeTime) {
         options.hour = '2-digit';
         options.minute = '2-digit';
      }

      return new Date(dateString).toLocaleString('en-IN', options);
   } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
   }
};

/**
 * Returns a relative time string (e.g., "2 hours ago", "yesterday")
 * @param {string|Date} dateString - The date to format
 * @returns {string} - Relative time string
 */
export const getRelativeTimeString = (dateString: string | Date) => {
   try {
      const date = new Date(dateString);
      const now = new Date();

      // Convert to IST for comparison
      const dateIST = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const nowIST = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

      const diffInMs = nowIST.getTime() - dateIST.getTime();
      const diffInSecs = Math.floor(diffInMs / 1000);
      const diffInMins = Math.floor(diffInSecs / 60);
      const diffInHours = Math.floor(diffInMins / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInSecs < 60) {
         return 'just now';
      }

      if (diffInMins < 60) {
         return `${diffInMins} minute${diffInMins > 1 ? 's' : ''} ago`;
      }

      if (diffInHours < 24) {
         return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      }

      if (diffInDays === 1) {
         return 'yesterday';
      }

      if (diffInDays < 30) {
         return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      }

      // For older dates, return the formatted date
      return formatDate(dateString);
   } catch (error) {
      console.error('Error generating relative time:', error);
      return 'Invalid date';
   }
};