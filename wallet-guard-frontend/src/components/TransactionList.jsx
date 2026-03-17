export default function TransactionList({ transactions = [] }) {
  if (!transactions.length)
    return <p className="empty-msg">No transactions yet.</p>;

  return (
    <ul className="transaction-list">
      {transactions.map((tx) => (
        <li key={tx._id} className="transaction-item">
          <div className="tx-left">
            <span className="tx-category-badge">{tx.category || "Other"}</span>
            <span className="tx-desc">{tx.description}</span>
          </div>
          <div className="tx-right">
            <span className="tx-amount">₹{tx.amount}</span>
            <span className="tx-date">
              {new Date(tx.createdAt).toLocaleDateString()}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}