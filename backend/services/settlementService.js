exports.calculateSettlement = (transactions) => {

  const balances = {};

  // Step 1: Calculate total paid per user
  transactions.forEach(tx => {
    const { userId, amount } = tx;

    if (!balances[userId]) balances[userId] = 0;

    balances[userId] += amount;
  });

  const users = Object.keys(balances);

  const total = users.reduce((sum, user) => sum + balances[user], 0);

  const avg = total / users.length;

  const debtors = [];
  const creditors = [];

  users.forEach(user => {

    const balance = balances[user] - avg;

    if (balance < 0) {
      debtors.push({ user, amount: -balance });
    } else if (balance > 0) {
      creditors.push({ user, amount: balance });
    }

  });

  const settlements = [];

  while (debtors.length && creditors.length) {

    const debtor = debtors[0];
    const creditor = creditors[0];

    const payment = Math.min(debtor.amount, creditor.amount);

    settlements.push({
      from: debtor.user,
      to: creditor.user,
      amount: payment
    });

    debtor.amount -= payment;
    creditor.amount -= payment;

    if (debtor.amount === 0) debtors.shift();
    if (creditor.amount === 0) creditors.shift();

  }

  return settlements;
};