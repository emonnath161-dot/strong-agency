export interface UserProfile {
  telegramUsername: string;
  displayName: string;
  photoUrl: string;
  balance: number;
}

export interface Order {
  id: string;
  userId: string;
  serviceName: string;
  price: number;
  status: 'pending' | 'success' | 'cancelled';
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'add' | 'spend';
  method?: string;
  transactionId?: string;
  status: 'pending' | 'success' | 'cancelled' | 'rejected';
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: 'vpn' | 'facebook' | 'instagram' | 'smm';
  isAvailable?: boolean;
}
