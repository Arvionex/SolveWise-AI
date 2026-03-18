export type Language = "en" | "hi";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: "free" | "premium" | "admin";
  createdAt: string;
}

export interface Problem {
  id?: string;
  user_id: string;
  problem_text: string;
  image_url?: string;
  audio_url?: string;
  category: string;
  ai_solution: string; // JSON string
  is_public: boolean;
  timestamp: string;
}

export interface Donation {
  id?: string;
  user_id?: string;
  displayName?: string;
  amount: number;
  message?: string;
  timestamp: string;
}

export interface AISolution {
  summary: string;
  causes: string[];
  steps: string[];
  cost: string;
  worker_type?: string;
}
