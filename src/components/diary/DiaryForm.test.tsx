import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import React from "react";

vi.mock("@/application/diary/diary-service", () => {
  class DiaryValidationError extends Error {
    reasons: string[];
    constructor(reasons: string[]) {
      super("Invalid diary");
      this.reasons = reasons;
    }
  }
  return { DiaryValidationError };
});

import { DiaryForm } from "./DiaryForm";
import { DiaryValidationError } from "@/application/diary/diary-service";
import enMessages from "../../../messages/en.json";

vi.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => {
    const source = namespace
      ? (enMessages as Record<string, unknown>)[namespace] ?? {}
      : enMessages;
    const dict = source as Record<string, string>;
    return (key: string) => (key.startsWith("validation_") ? key : dict[key] ?? key);
  },
}));

vi.mock("@/i18n/routing", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("DiaryForm", () => {
  it("submits date and content", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(<DiaryForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: "2025-01-02" },
    });
    fireEvent.change(screen.getByLabelText(/diary content/i), {
      target: { value: "Hello world" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save entry/i }));

    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          date: "2025-01-02",
          content: "Hello world",
        })
      )
    );
  });

  it("shows validation error from DiaryValidationError", async () => {
    const handleSubmit = vi
      .fn()
      .mockRejectedValue(new DiaryValidationError(["invalid-date"]));
    render(<DiaryForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/diary content/i), {
      target: { value: "hello" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save entry/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/validation_invalid_date/i)
      ).toBeInTheDocument()
    );
  });
});
