export type UserRole = "STUDENT" | "PARKING_STAFF" | "MANAGER";

export type AppUser = {
  id: number;
  username: string;
  fullName: string;
  role: UserRole;
  studentCode: string | null;
  mustChangePassword?: boolean;
  passwordChangedAt?: string | null;
};

export type AppStudent = {
  id: number;
  studentCode: string;
  fullName: string;
  email: string;
  balance: number;
  status: "active" | "locked";
  createdAt: string;
  updatedAt: string;
};