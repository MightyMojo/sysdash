// A reusable dashboard tile.
// Its props are typed, so the editor warns us if a value is missing or has the wrong type.
type TileProps = {
  title: string;
  value: number;
  unit: string;
};

export default function Tile({ title, value, unit }: TileProps) {
  return (
    <div className="rounded-xl bg-slate-800 p-5 shadow-lg">
      <h3 className="text-sm font-medium text-slate-400">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-white">
        {value} <span className="text-lg font-normal text-slate-400">{unit}</span>
      </p>
    </div>
  );
}
