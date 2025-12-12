import { render, screen, fireEvent } from "@testing-library/react";
import DiaryListPage from "./page";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useDiaryList, useDiaryMutations } from "@/application/diary/hooks";
import { useAuth } from "@/application/auth/AuthProvider";

// Mock dependencies
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

vi.mock("@/application/diary/hooks", () => ({
  useDiaryList: vi.fn(),
  useDiaryMutations: vi.fn(),
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

vi.mock("@/i18n/routing", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

vi.mock("@/components/auth/AuthGate", () => ({
  AuthGate: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/Card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}));

describe("DiaryListPage", () => {
  const mockRemove = { mutateAsync: vi.fn(), isPending: false };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ user: { uid: "user123" }, loading: false });
    (useDiaryMutations as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ remove: mockRemove });
  });

  it("renders loading state", () => {
    (useDiaryList as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: [], isLoading: true });
    render(<DiaryListPage />);
    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    (useDiaryList as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: [], isLoading: false });
    render(<DiaryListPage />);
    expect(screen.getByText("empty")).toBeInTheDocument();
  });

  it("renders diary list", () => {
    const diaries = [
      {
        id: "1",
        userId: "user123",
        date: "2024-01-15",
        content: "Test diary entry content",
        imageUrl: undefined,
        aiReviewed: false,
        createdAt: new Date(),
      },
    ];
    (useDiaryList as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: diaries, isLoading: false });
    render(<DiaryListPage />);
    expect(screen.getAllByText(/Test diary entry content/i)[0]).toBeInTheDocument();
  });

  it("filters diaries by year", () => {
    const diaries = [
      {
        id: "1",
        userId: "user123",
        date: "2024-01-15",
        content: "2024 Entry",
        imageUrl: undefined,
        aiReviewed: false,
        createdAt: new Date(),
      },
      {
        id: "2",
        userId: "user123",
        date: "2023-06-10",
        content: "2023 Entry",
        imageUrl: undefined,
        aiReviewed: false,
        createdAt: new Date(),
      },
    ];
    (useDiaryList as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: diaries, isLoading: false });
    render(<DiaryListPage />);

    // Initially shows all
    expect(screen.getAllByText(/2024 Entry/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/2023 Entry/i)[0]).toBeInTheDocument();

    // Filter by year
    const yearSelect = screen.getByRole("combobox");
    fireEvent.change(yearSelect, { target: { value: "2024" } });

    expect(screen.getAllByText(/2024 Entry/i)[0]).toBeInTheDocument();
    expect(screen.queryByText(/2023 Entry/i)).not.toBeInTheDocument();
  });

  it("filters diaries by month", () => {
    const diaries = [
      {
        id: "1",
        userId: "user123",
        date: "2024-01-15",
        content: "January Entry",
        imageUrl: undefined,
        aiReviewed: false,
        createdAt: new Date(),
      },
      {
        id: "2",
        userId: "user123",
        date: "2024-06-10",
        content: "June Entry",
        imageUrl: undefined,
        aiReviewed: false,
        createdAt: new Date(),
      },
    ];
    (useDiaryList as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: diaries, isLoading: false });
    render(<DiaryListPage />);

    // Initially shows all
    expect(screen.getAllByText(/January Entry/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/June Entry/i)[0]).toBeInTheDocument();

    // Filter to January (month 0)
    const januaryButton = screen.getByRole("button", { name: /Jan/i });
    fireEvent.click(januaryButton);

    expect(screen.getAllByText(/January Entry/i)[0]).toBeInTheDocument();
    expect(screen.queryByText(/June Entry/i)).not.toBeInTheDocument();
  });

  it("filters diaries by specific date", () => {
    const diaries = [
      {
        id: "1",
        userId: "user123",
        date: "2024-01-15",
        content: "Specific Date Entry",
        imageUrl: undefined,
        aiReviewed: false,
        createdAt: new Date(),
      },
      {
        id: "2",
        userId: "user123",
        date: "2024-01-16",
        content: "Other Date Entry",
        imageUrl: undefined,
        aiReviewed: false,
        createdAt: new Date(),
      },
    ];
    (useDiaryList as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: diaries, isLoading: false });
    render(<DiaryListPage />);

    // Initially shows all
    expect(screen.getAllByText(/Specific Date Entry/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Other Date Entry/i)[0]).toBeInTheDocument();

    // Find date input - explicit selector since there might not be a label accessible
    const dateInput = document.querySelector('input[type="date"]');
    if (!dateInput) throw new Error("Date input not found");
    
    fireEvent.change(dateInput, { target: { value: "2024-01-15" } });

    expect(screen.getAllByText(/Specific Date Entry/i)[0]).toBeInTheDocument();
    expect(screen.queryByText(/Other Date Entry/i)).not.toBeInTheDocument();
  });
});
