import { describe, expect, it, vi, beforeEach } from "vitest";
import { firebaseDiaryRepository } from "./diary-repository";
import { getDocs, query, where, orderBy } from "firebase/firestore";

// Mock firebase/firestore
vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual("firebase/firestore");
  return {
    ...actual,
    getFirestore: vi.fn(),
    collection: vi.fn(),
    addDoc: vi.fn(),
    getDocs: vi.fn(),
    getDoc: vi.fn(),
    doc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    serverTimestamp: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
  };
});

// Mock firebase storage
vi.mock("firebase/storage", () => ({
  getStorage: vi.fn(),
  ref: vi.fn(),
  uploadBytesResumable: vi.fn(),
  getDownloadURL: vi.fn(),
}));

// Mock firebase app
vi.mock("@/lib/firebase", () => ({
  db: {},
  storage: {},
}));

describe("diary-repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getDocs as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      docs: [],
    });
  });

  describe("listByUser", () => {
    it("returns empty array if no userId", async () => {
      const result = await firebaseDiaryRepository.listByUser("", undefined);
      expect(result).toEqual([]);
      expect(getDocs).not.toHaveBeenCalled();
    });

    it("queries with userId filter", async () => {
      await firebaseDiaryRepository.listByUser("user123");
      
      expect(where).toHaveBeenCalledWith("userId", "==", "user123");
      expect(query).toHaveBeenCalled();
    });

    it("queries with userId and year filter", async () => {
      await firebaseDiaryRepository.listByUser("user123", 2024);
      
      expect(where).toHaveBeenCalledWith("userId", "==", "user123");
      expect(where).toHaveBeenCalledWith("date", ">=", "2024-01-01");
      expect(where).toHaveBeenCalledWith("date", "<=", "2024-12-31");
      expect(query).toHaveBeenCalled();
    });
  });
});
