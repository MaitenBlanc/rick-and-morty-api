import { User } from "../../auth/interfaces/auth.interface";

export interface Comment {
  id: string;
  content: string;
  episodeId: number;
  isActive: boolean;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}
