import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock nanoid to return deterministic IDs in tests
let idCounter = 0;
vi.mock("nanoid", () => ({
  nanoid: () => `test-id-${++idCounter}`,
}));

// Reset the counter before each test
beforeEach(() => {
  idCounter = 0;
});
