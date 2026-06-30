const controls = [
  {
    keys: ["W", "Click + hold"],
    action: "Thrust forward toward cursor or current heading",
  },
  {
    keys: ["A", "D"],
    action: "Turn left / right",
  },
  {
    keys: ["Space"],
    action: "Brake / slow down",
  },
  {
    keys: ["L"],
    action: "Land when within docking range",
  },
];

export function ControlsHelp() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-6">
      <h2 className="text-lg font-semibold text-white">Controls</h2>
      <ul className="mt-4 space-y-3">
        {controls.map((control) => (
          <li
            key={control.action}
            className="flex flex-col gap-1 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="flex flex-wrap gap-2">
              {control.keys.map((key) => (
                <kbd
                  key={key}
                  className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-cyan-300"
                >
                  {key}
                </kbd>
              ))}
            </span>
            <span className="text-slate-400">{control.action}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
