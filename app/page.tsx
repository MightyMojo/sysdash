import Tile from "@/components/Tile";
// Hands-on 3: you need this line to load the data.
// import { systems } from "@/data/systems";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">SysDash</h1>
        <p className="text-slate-400">System status at a glance</p>
      </header>

      <section className="grid grid-cols-1 gap-4">
        {/* Hands-on 2: change the title and value of this tile, then save. */}
        <Tile title="CPU Load" value={42} unit="%" />

        {/*
          Hands-on 3: instead of writing tiles by hand, render one per record.
          Import `systems` above and replace the tile above with:

          {systems.map((s) => (
            <Tile key={s.id} title={s.title} value={s.value} unit={s.unit} />
          ))}
        */}
      </section>
    </main>
  );
}
