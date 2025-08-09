interface Protest {
  id: number;
  race: string;
  issue: string;
}

const myProtests: Protest[] = [
  { id: 1, race: "Harbor Sprint", issue: "Right of way" },
];

const allProtests: Protest[] = [
  { id: 1, race: "Regatta Bay", issue: "Collision" },
  { id: 2, race: "Ocean Blast", issue: "False start" },
];

const ProtestRoom = () => (
  <div className="space-y-6 p-4">
    <section>
      <h1 className="mb-2 text-xl font-bold">My Protests</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="p-2">Race</th>
            <th className="p-2">Issue</th>
          </tr>
        </thead>
        <tbody>
          {myProtests.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.race}</td>
              <td className="p-2">{p.issue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
    <section>
      <h2 className="mb-2 text-xl font-bold">All Protests</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="p-2">Race</th>
            <th className="p-2">Issue</th>
          </tr>
        </thead>
        <tbody>
          {allProtests.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.race}</td>
              <td className="p-2">{p.issue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  </div>
);

export default ProtestRoom;
