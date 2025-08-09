interface Race {
  id: number;
  name: string;
  ranking: number;
}

const races: Race[] = [
  { id: 1, name: "Regatta Bay", ranking: 1 },
  { id: 2, name: "Ocean Blast", ranking: 2 },
  { id: 3, name: "Harbor Sprint", ranking: 5 },
];

const Play = () => (
  <div className="p-4">
    <h1 className="mb-2 text-xl font-bold">Available Races</h1>
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left">
          <th className="p-2">Race</th>
          <th className="p-2">Ranking</th>
          <th className="p-2">Boat</th>
        </tr>
      </thead>
      <tbody>
        {races.map((race) => (
          <tr key={race.id} className="border-t">
            <td className="p-2">{race.name}</td>
            <td className="p-2">{race.ranking}</td>
            <td className="p-2">
              <div className="h-4 w-8 bg-gray-300" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Play;
