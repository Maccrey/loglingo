import { render, screen, fireEvent } from "@testing-library/react";
import ArchivePage from "./page";
import { vi, describe, it, expect, beforeEach } from "vitest";
import {
  useArchiveList,
  useArchiveMutations,
  useArchiveDeleteMutation,
  useArchiveProgressMutation,
  useQuiz,
} from "@/application/archive/hooks";
import { useAuth } from "@/application/auth/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock dependencies
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

vi.mock("@/i18n/routing", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => "/en/archive"),
  Link: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/application/archive/hooks", () => ({
  useArchiveList: vi.fn(),
  useArchiveMutations: vi.fn(),
  useArchiveDeleteMutation: vi.fn(),
  useArchiveProgressMutation: vi.fn(),
  useQuiz: vi.fn(),
}));

vi.mock("@/application/auth/AuthProvider", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/lib/firebase", () => ({
  auth: { currentUser: { uid: "user123" } },
  db: {},
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(() => ({})),
  doc: vi.fn(() => ({})),
  getDoc: vi.fn(async () => ({ exists: () => false, data: () => ({}) })),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  getDocs: vi.fn(async () => ({ docs: [] })),
  query: vi.fn(() => ({})),
  where: vi.fn(() => ({})),
  serverTimestamp: vi.fn(() => new Date()),
  Timestamp: class {
    toDate() {
      return new Date();
    }
  },
  deleteDoc: vi.fn(),
}));

vi.mock("firebase/storage", () => ({
  ref: vi.fn(() => ({})),
  uploadBytesResumable: vi.fn(() => ({
    on: vi.fn(),
    snapshot: { ref: { fullPath: "" } },
  })),
  getDownloadURL: vi.fn(async () => ""),
  deleteObject: vi.fn(),
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

vi.mock("@/components/ads/KakaoAdFit", () => ({
  __esModule: true,
  default: () => <div data-testid="kakao-ad-fit" />,
}));

vi.mock("@/components/ads/ResponsiveAd", () => ({
  ResponsiveAd: () => <div data-testid="responsive-ad" />,
}));

describe("ArchivePage", () => {
  const mockCreate = { mutateAsync: vi.fn(), isPending: false };
  const queryClient = new QueryClient();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ user: { uid: "user123" }, loading: false });
    (useArchiveMutations as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ create: mockCreate });
    (useArchiveDeleteMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ mutateAsync: vi.fn() });
    (useArchiveProgressMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ update: vi.fn() });
    (useQuiz as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ quiz: null, isLoading: false, error: null });
  });

  it("renders loading state", () => {
    (useArchiveList as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: [], isLoading: true });
    render(
      <QueryClientProvider client={queryClient}>
        <ArchivePage />
      </QueryClientProvider>
    );
    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    (useArchiveList as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: [], isLoading: false });
    render(
      <QueryClientProvider client={queryClient}>
        <ArchivePage />
      </QueryClientProvider>
    );
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
    (useArchiveList as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: archives, isLoading: false });
    render(
      <QueryClientProvider client={queryClient}>
        <ArchivePage />
      </QueryClientProvider>
    );
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
    (useArchiveList as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: archives, isLoading: false });
    render(
      <QueryClientProvider client={queryClient}>
        <ArchivePage />
      </QueryClientProvider>
    );

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
