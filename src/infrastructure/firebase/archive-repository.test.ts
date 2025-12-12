import { describe, expect, it, vi, beforeEach } from "vitest";
import { listArchive, checkDuplicate } from "./archive-repository";
import { getDocs, query, where } from "firebase/firestore";

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
    (getDocs as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
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
      expect(query).toHaveBeenCalled();
    });

    it("queries with userId and type filter", async () => {
      await listArchive("user123", "grammar");
      
      expect(where).toHaveBeenCalledWith("userId", "==", "user123");
      expect(where).toHaveBeenCalledWith("type", "==", "grammar");
      expect(query).toHaveBeenCalled();
    });

    it("queries with userId and sourceId filter", async () => {
      await listArchive("user123", undefined, "diary_1");
      
      expect(where).toHaveBeenCalledWith("userId", "==", "user123");
      // Note: We need to verify implementation order, but for now checking call existence
      expect(where).toHaveBeenCalledWith("sourceId", "==", "diary_1");
      expect(query).toHaveBeenCalled();
    });
  });

  describe("checkDuplicate", () => {

    it("returns false if no userId or title", async () => {
      expect(await checkDuplicate("", "title")).toBe(false);
      expect(await checkDuplicate("user", "")).toBe(false);
      expect(getDocs).not.toHaveBeenCalled();
    });

    it("checks for duplicate using only userId and title if sourceId is missing", async () => {
      await checkDuplicate("user123", "test title");
      
      expect(where).toHaveBeenCalledWith("userId", "==", "user123");
      expect(where).toHaveBeenCalledWith("title", "==", "test title");
      // Should NOT call with sourceId
      expect(where).not.toHaveBeenCalledWith("sourceId", "==", expect.anything());
      expect(query).toHaveBeenCalled();
    });

    it("checks for duplicate using userId, title, AND sourceId if sourceId is provided", async () => {
      await checkDuplicate("user123", "test title", "diary_1");
      
      expect(where).toHaveBeenCalledWith("userId", "==", "user123");
      expect(where).toHaveBeenCalledWith("title", "==", "test title");
      expect(where).toHaveBeenCalledWith("sourceId", "==", "diary_1");
      expect(query).toHaveBeenCalled();
    });
  });
});

