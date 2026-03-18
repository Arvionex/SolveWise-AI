import { Problem, UserProfile, Donation } from "./types";

// Mock data
const MOCK_PROBLEMS: Problem[] = [
  {
    id: "1",
    user_id: "mock-user",
    problem_text: "My phone is overheating",
    category: "tech",
    ai_solution: JSON.stringify({
      summary: "Your phone is overheating due to high CPU usage.",
      causes: ["Too many background apps", "Direct sunlight", "Faulty battery"],
      steps: ["Close background apps", "Remove case", "Move to a cooler place"],
      cost: "₹0",
      worker_type: "Self"
    }),
    is_public: true,
    timestamp: new Date().toISOString()
  },
  {
    id: "2",
    user_id: "mock-user",
    problem_text: "Leaking faucet in kitchen",
    category: "home",
    ai_solution: JSON.stringify({
      summary: "The faucet is leaking due to a worn-out washer.",
      causes: ["Worn-out washer", "Loose parts", "Corrosion"],
      steps: ["Turn off water supply", "Disassemble faucet", "Replace washer"],
      cost: "₹200 - ₹500",
      worker_type: "Plumber"
    }),
    is_public: true,
    timestamp: new Date().toISOString()
  }
];

const MOCK_DONATIONS: Donation[] = [
  {
    id: "d1",
    displayName: "John Doe",
    amount: 500,
    message: "Great work!",
    timestamp: new Date().toISOString()
  },
  {
    id: "d2",
    displayName: "Jane Smith",
    amount: 100,
    message: "Keep it up!",
    timestamp: new Date().toISOString()
  }
];

const MOCK_USER: UserProfile = {
  uid: "mock-user",
  email: "9211ravikumar2@gmail.com",
  displayName: "Mock Admin",
  role: "admin",
  createdAt: new Date().toISOString()
};

export const mockDb = {
  problems: MOCK_PROBLEMS,
  donations: MOCK_DONATIONS,
  user: MOCK_USER
};

// Mock functions to simulate Firestore operations
export const getMockProblems = () => Promise.resolve(MOCK_PROBLEMS);
export const getMockDonations = () => Promise.resolve(MOCK_DONATIONS);
export const getMockUser = () => Promise.resolve(MOCK_USER);

export const addMockProblem = (problem: Omit<Problem, "id">) => {
  const newProblem = { ...problem, id: Math.random().toString(36).substr(2, 9) };
  MOCK_PROBLEMS.unshift(newProblem as Problem);
  return Promise.resolve(newProblem);
};

export const addMockDonation = (donation: Omit<Donation, "id">) => {
  const newDonation = { ...donation, id: Math.random().toString(36).substr(2, 9) };
  MOCK_DONATIONS.unshift(newDonation as Donation);
  return Promise.resolve(newDonation);
};
