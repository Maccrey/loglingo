import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ArchivePage from "./page";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useArchiveList, useArchiveMutations, useQuiz } from "@/application/archive/hooks";
import { useAuth } from "@/application/auth/AuthProvider";

// Mock dependencies
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

vi.mock("@/application/archive/hooks", () => ({
  useArchiveList: vi.fn(),
  useArchiveMutations: vi.fn(),
  useQuiz: vi.fn(),
}));

vi.mock("@/application/auth/AuthProvider", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/lib/firebase", () => ({
  auth: { currentUser: { uid: "user123" } },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

vi.mock("@/components/auth/AuthGate", () => ({
  AuthGate: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock UI components to avoid issues with them
vi.mock("@/components/ui/Card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("ArchivePage", () => {
  const mockCreate = { mutateAsync: vi.fn(), isPending: false };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ user: { uid: "user123" }, loading: false });
    (useArchiveMutations as any).mockReturnValue({ create: mockCreate });
    (useQuiz as any).mockReturnValue(null);
  });

  it("renders loading state", () => {
    (useArchiveList as any).mockReturnValue({ data: [], isLoading: true });
    render(<ArchivePage />);
    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    (useArchiveList as any).mockReturnValue({ data: [], isLoading: false });
    render(<ArchivePage />);
    expect(screen.getByText("empty")).toBeInTheDocument();
  });

  it("renders archive list", () => {
    const archives = [
      {
        id: "1",
        userId: "user123",
        type: "grammar",
        title: "Test Grammar",
        rootMeaning: "Meaning",
        examples: ["Example"],
        createdAt: new Date(),
      },
    ];
    (useArchiveList as any).mockReturnValue({ data: archives, isLoading: false });
    render(<ArchivePage />);
    expect(screen.getByText("Test Grammar")).toBeInTheDocument();
  });

  it("filters archives", async () => {
    const archives = [
      {
        id: "1",
        userId: "user123",
        type: "grammar",
        title: "Grammar Item",
        rootMeaning: "Meaning",
        examples: [],
        createdAt: new Date(),
      },
      {
        id: "2",
        userId: "user123",
        type: "word",
        title: "Word Item",
        rootMeaning: "Meaning",
        examples: [],
        createdAt: new Date(),
      },
    ];
    (useArchiveList as any).mockReturnValue({ data: archives, isLoading: false });
    render(<ArchivePage />);

    // Initially shows all
    expect(screen.getByText("Grammar Item")).toBeInTheDocument();
    expect(screen.getByText("Word Item")).toBeInTheDocument();

    // Click Grammar filter
    fireEvent.click(screen.getByRole("button", { name: "grammar" }));
    expect(screen.getByText("Grammar Item")).toBeInTheDocument();
    expect(screen.queryByText("Word Item")).not.toBeInTheDocument();

    // Click Vocabulary filter
    fireEvent.click(screen.getByRole("button", { name: "vocabulary" }));
    expect(screen.queryByText("Grammar Item")).not.toBeInTheDocument();
    expect(screen.getByText("Word Item")).toBeInTheDocument();
  });
});
