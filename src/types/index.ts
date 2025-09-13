export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface CreatePurchaseRequestDTO {
  title: string;
  description?: string;
  items: CreatePurchaseItemDTO[];
}

export interface CreatePurchaseItemDTO {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface UpdatePurchaseRequestDTO {
  title?: string;
  description?: string;
  status?: 'APPROVED' | 'REJECTED' | 'CANCELLED';
  reason?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  role?: 'REQUESTER' | 'APPROVER' | 'ADMIN';
}
