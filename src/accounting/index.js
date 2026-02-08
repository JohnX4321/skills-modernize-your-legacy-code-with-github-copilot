const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("node:process");

let storageBalance = 1000.0;

const OPERATION_CODES = {
  TOTAL: "TOTAL ",
  CREDIT: "CREDIT",
  DEBIT: "DEBIT ",
};

function resetBalance(value = 1000.0) {
  storageBalance = value;
}

function dataProgram(operation, balance) {
  if (operation === "READ") {
    return storageBalance;
  }

  if (operation === "WRITE") {
    storageBalance = balance;
    return storageBalance;
  }

  return storageBalance;
}

function formatAmount(value) {
  return value.toFixed(2);
}

function parseAmount(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function operations(passedOperation, rl, logger = console) {
  if (passedOperation === OPERATION_CODES.TOTAL) {
    const balance = dataProgram("READ");
    logger.log(`Current balance: ${formatAmount(balance)}`);
    return;
  }

  if (passedOperation === OPERATION_CODES.CREDIT) {
    const amountInput = await rl.question("Enter credit amount: ");
    const amount = parseAmount(amountInput);
    const balance = dataProgram("READ");
    const newBalance = balance + amount;
    dataProgram("WRITE", newBalance);
    logger.log(`Amount credited. New balance: ${formatAmount(newBalance)}`);
    return;
  }

  if (passedOperation === OPERATION_CODES.DEBIT) {
    const amountInput = await rl.question("Enter debit amount: ");
    const amount = parseAmount(amountInput);
    const balance = dataProgram("READ");

    if (balance >= amount) {
      const newBalance = balance - amount;
      dataProgram("WRITE", newBalance);
      logger.log(`Amount debited. New balance: ${formatAmount(newBalance)}`);
    } else {
      logger.log("Insufficient funds for this debit.");
    }
  }
}

async function runMenu({ rl, logger = console } = {}) {
  const activeRl = rl || readline.createInterface({ input, output });
  const shouldClose = !rl;
  let continueFlag = true;

  while (continueFlag) {
    logger.log("--------------------------------");
    logger.log("Account Management System");
    logger.log("1. View Balance");
    logger.log("2. Credit Account");
    logger.log("3. Debit Account");
    logger.log("4. Exit");
    logger.log("--------------------------------");

    const choice = await activeRl.question("Enter your choice (1-4): ");

    switch (choice.trim()) {
      case "1":
        await operations(OPERATION_CODES.TOTAL, activeRl, logger);
        break;
      case "2":
        await operations(OPERATION_CODES.CREDIT, activeRl, logger);
        break;
      case "3":
        await operations(OPERATION_CODES.DEBIT, activeRl, logger);
        break;
      case "4":
        continueFlag = false;
        break;
      default:
        logger.log("Invalid choice, please select 1-4.");
        break;
    }
  }

  logger.log("Exiting the program. Goodbye!");

  if (shouldClose && activeRl.close) {
    activeRl.close();
  }
}

if (require.main === module) {
  runMenu();
}

module.exports = {
  OPERATION_CODES,
  dataProgram,
  formatAmount,
  parseAmount,
  operations,
  resetBalance,
  runMenu,
};
