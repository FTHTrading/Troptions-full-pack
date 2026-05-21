import type { XrplOrderBookRecord } from "@/content/troptions/xrplOrderBookRegistry";

export function XrplOrderBookTable({ books }: { readonly books: readonly XrplOrderBookRecord[] }) {
  return (
    <div className="xp-tableWrap">
      <table className="xp-table">
        <thead>
          <tr>
            <th>Pair</th>
            <th>Method</th>
            <th>Best Bid</th>
            <th>Best Ask</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.pair}</td>
              <td className="xp-code">{book.method}</td>
              <td className="xp-code">{book.bids[0] ? `${book.bids[0].price} / ${book.bids[0].amount}` : "n/a"}</td>
              <td className="xp-code">{book.asks[0] ? `${book.asks[0].price} / ${book.asks[0].amount}` : "n/a"}</td>
              <td><span className={`xp-badge xp-badge-${book.status}`}>{book.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}