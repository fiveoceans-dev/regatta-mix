interface Result {
  id: number;
  race: string;
  position: number;
  date: string;
}

const results: Result[] = [
  { id: 1, race: "Regatta Bay", position: 2, date: "2024-05-01" },
  { id: 2, race: "Ocean Blast", position: 1, date: "2024-05-10" },
];

const History = () => (
  <div className="p-4">
    <h1 className="mb-2 text-xl font-bold">Recent Games</h1>
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left">
          <th className="p-2">Race</th>
          <th className="p-2">Position</th>
          <th className="p-2">Date</th>
          <th className="p-2">Replay</th>
        </tr>
      </thead>
      <tbody>
        {results.map((r) => (
          <tr key={r.id} className="border-t">
            <td className="p-2">{r.race}</td>
            <td className="p-2">{r.position}</td>
            <td className="p-2">{r.date}</td>
            <td className="p-2">
              <button className="rounded border px-2 py-1 text-xs">Replay</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default History;
