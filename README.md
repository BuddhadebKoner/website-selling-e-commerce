# E-commerce Platform Data Model (Clerk Auth)

## 1. User
- name: string;
- email: string;
- phone: string;
- address: string;
- role: string;
- imageUrl: string;
- imageId: string;
- orders: mongoose.Types.ObjectId[];
- cart: mongoose.Types.ObjectId[];
- products: mongoose.Types.ObjectId[];
- favorite: mongoose.Types.ObjectId[];

## 2. Admin
- name: string;
- email: string;
- role: string;            
- isMaster: boolean;        
- permissions: string[];   
- imageUrl: string;
- createdAt: Date;
- updatedAt: Date;

## 3. Product
- creator: mongoose.Types.ObjectId;
- title: string;
- subTitle: string;
- slug: string;
- link: string;
- productType: string;
- productAbout: string;
- tags: string[];
- price: number;
- websiteAge: number;
- status: string;
- images: string[];
- bannerImageUrl: string;
- bannerImageID: string;
- technologyStack: string[];
- is_featured: boolean;
- category: mongoose.Types.ObjectId;
- rating: mongoose.Types.ObjectId;
- offer: mongoose.Types.ObjectId;
- stock: number;

## 4. Order
- owner: mongoose.Types.ObjectId;
- products: mongoose.Types.ObjectId[];
- totalAmount: number;
- discount: string;
- status: string;
- paymentStatus: string;
- payment: string;
- orderDate: Date;
- paymentDate: Date;
- deliveryDate: Date;
- trackId: string;
- invoiceId: string;
- customerNote: string;

## 5. Category
- name: string;
- slug: string;
- description: string;
- imageUrl: string;
- imageId: string;
- parent: mongoose.Types.ObjectId;
- isFeatured: boolean;
- products: mongoose.Types.ObjectId[];

## 6. Rating
- user: mongoose.Types.ObjectId;
- product: mongoose.Types.ObjectId;
- rating: number;
- comment: string;
- likes: mongoose.Types.ObjectId[];
- helpfulness_score: number;
- reply_to: mongoose.Types.ObjectId;
- verified_purchase: boolean;
- created_at: Date;
- updated_at: Date;
- images: string[];
- sentiment_score: number;
- reported_count: number;
- is_featured: boolean;
- is_hidden: boolean;

## 7. Offer
- offerName: string;
- description: string;
- status: string;
- type: string;
- discount: number;
- offerStartDate: Date;
- offerEndDate: Date;
- products: mongoose.Types.ObjectId[];
- isFeatured: boolean;

## 8. Cart
- user: mongoose.Types.ObjectId;
- products: mongoose.Types.ObjectId[];
- quantity: number[];
- totalAmount: number;
- cartCreatedAt: Date;

## 9. Payment (or Transaction)
- order: mongoose.Types.ObjectId;
- user: mongoose.Types.ObjectId;
- paymentGateway: string;
- transactionId: string;
- amount: number;
- status: string;
- paymentDate: Date;
- createdAt: Date;
- updatedAt: Date;

## 10. Notification
- recipient: mongoose.Types.ObjectId; 
- title: string;
- message: string;
- isRead: boolean;
- createdAt: Date;
- updatedAt: Date;

## 11. (Optional) Return/Refund
- order: mongoose.Types.ObjectId;
- user: mongoose.Types.ObjectId;
- reason: string;
- status: string;        
- refundAmount: number;
- createdAt: Date;
- updatedAt: Date;
