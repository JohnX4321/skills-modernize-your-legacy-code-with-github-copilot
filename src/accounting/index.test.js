const {
  OPERATION_CODES,
  dataProgram,
  operations,
  resetBalance,
  runMenu,
} = require("./index");

function createMockRl(responses) {
  let index = 0;
  return {
    question: async () => {
      const value = responses[index];
      index += 1;
      return value ?? "";
    },
    close: jest.fn(),
  };
}

function createLogger() {
  const messages = [];
  return {
    log: (message) => {
      messages.push(message);
    },
    messages,
  };
}

beforeEach(() => {
  resetBalance();
});

test("TC-001 View balance from main menu", async () => {
  const logger = createLogger();
  const rl = createMockRl([]);

  await operations(OPERATION_CODES.TOTAL, rl, logger);

  expect(logger.messages).toContain("Current balance: 1000.00");
});

test("TC-002 Credit increases balance", async () => {
  const logger = createLogger();
  const rl = createMockRl(["50.00"]);

  await operations(OPERATION_CODES.CREDIT, rl, logger);

  expect(dataProgram("READ")).toBeCloseTo(1050.0, 2);
  expect(logger.messages).toContain("Amount credited. New balance: 1050.00");
});

test("TC-003 Debit decreases balance when sufficient", async () => {
  const logger = createLogger();
  const rl = createMockRl(["200.00"]);

  await operations(OPERATION_CODES.DEBIT, rl, logger);

  expect(dataProgram("READ")).toBeCloseTo(800.0, 2);
  expect(logger.messages).toContain("Amount debited. New balance: 800.00");
});

test("TC-004 Debit blocked when insufficient funds", async () => {
  const logger = createLogger();
  const rl = createMockRl(["2000.00"]);

  await operations(OPERATION_CODES.DEBIT, rl, logger);

  expect(dataProgram("READ")).toBeCloseTo(1000.0, 2);
  expect(logger.messages).toContain("Insufficient funds for this debit.");
});

test("TC-005 Sequential credit then debit updates balance", async () => {
  const logger = createLogger();
  const rl = createMockRl(["100.00", "40.00"]);

  await operations(OPERATION_CODES.CREDIT, rl, logger);
  await operations(OPERATION_CODES.DEBIT, rl, logger);
  await operations(OPERATION_CODES.TOTAL, rl, logger);

  expect(dataProgram("READ")).toBeCloseTo(1060.0, 2);
  expect(logger.messages).toContain("Current balance: 1060.00");
});

test("TC-006 Invalid menu option handling", async () => {
  const logger = createLogger();
  const rl = createMockRl(["9", "4"]);

  await runMenu({ rl, logger });

  expect(logger.messages).toContain("Invalid choice, please select 1-4.");
  expect(logger.messages).toContain("Exiting the program. Goodbye!");
});

test("TC-007 Exit program", async () => {
  const logger = createLogger();
  const rl = createMockRl(["4"]);

  await runMenu({ rl, logger });

  expect(logger.messages).toContain("Exiting the program. Goodbye!");
});

test("TC-008 Operation code mapping for View Balance", async () => {
  const logger = createLogger();
  const rl = createMockRl(["1", "4"]);

  await runMenu({ rl, logger });

  expect(logger.messages).toContain("Current balance: 1000.00");
});

test("TC-009 Operation code mapping for Credit", async () => {
  const logger = createLogger();
  const rl = createMockRl(["2", "10.00", "4"]);

  await runMenu({ rl, logger });

  expect(logger.messages).toContain("Amount credited. New balance: 1010.00");
});

test("TC-010 Operation code mapping for Debit", async () => {
  const logger = createLogger();
  const rl = createMockRl(["3", "10.00", "4"]);

  await runMenu({ rl, logger });

  expect(logger.messages).toContain("Amount debited. New balance: 990.00");
});

test("TC-011 Data program read operation", () => {
  expect(dataProgram("READ")).toBeCloseTo(1000.0, 2);
});

test("TC-012 Data program write operation", () => {
  dataProgram("WRITE", 1010.0);

  expect(dataProgram("READ")).toBeCloseTo(1010.0, 2);
});

test("TC-013 Balance persists within single run", async () => {
  const logger = createLogger();
  const rl = createMockRl(["25.00", "5.00"]);

  await operations(OPERATION_CODES.CREDIT, rl, logger);
  await operations(OPERATION_CODES.TOTAL, rl, logger);
  await operations(OPERATION_CODES.DEBIT, rl, logger);
  await operations(OPERATION_CODES.TOTAL, rl, logger);

  expect(dataProgram("READ")).toBeCloseTo(1020.0, 2);
  expect(logger.messages).toContain("Current balance: 1020.00");
});

test("TC-014 Debit equals balance allowed", async () => {
  const logger = createLogger();
  const rl = createMockRl(["1000.00"]);

  await operations(OPERATION_CODES.DEBIT, rl, logger);

  expect(dataProgram("READ")).toBeCloseTo(0.0, 2);
  expect(logger.messages).toContain("Amount debited. New balance: 0.00");
});

test("TC-015 Menu loop continues after valid operations", async () => {
  const logger = createLogger();
  const rl = createMockRl(["1", "1", "4"]);

  await runMenu({ rl, logger });

  const balanceMessages = logger.messages.filter((message) =>
    message.includes("Current balance:")
  );

  expect(balanceMessages).toHaveLength(2);
});
