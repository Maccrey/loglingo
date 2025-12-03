import { describe, expect, it, vi, beforeEach } from "vitest";
import { listArchive } from "./archive-repository";
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
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    serverTimestamp: vi.fn(),
  };
});

// Mock firebase app
vi.mock("@/lib/firebase", () => ({
  db: {},
}));

describe("archive-repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getDocs as any).mockResolvedValue({
      docs: [],
    });
  });

  describe("listArchive", () => {
    it("returns empty array if no userId", async () => {
      const result = await listArchive("", "grammar");
      expect(result).toEqual([]);
      expect(getDocs).not.toHaveBeenCalled();
    });

    it("queries with userId filter", async () => {
      await listArchive("user123");
      
      expect(where).toHaveBeenCalledWith("userId", "==", "user123");
      expect(orderBy).toHaveBeenCalledWith("createdAt", "desc");
      expect(query).toHaveBeenCalled();
    });

    it("queries with userId and type filter", async () => {
      await listArchive("user123", "grammar");
      
      expect(where).toHaveBeenCalledWith("userId", "==", "user123");
      expect(where).toHaveBeenCalledWith("type", "==", "grammar");
      expect(orderBy).toHaveBeenCalledWith("createdAt", "desc");
      expect(query).toHaveBeenCalled();
    });
  });
});
