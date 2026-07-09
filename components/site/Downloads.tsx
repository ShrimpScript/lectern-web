"use client";
import { releases } from "@/lib/data/content";
import { Item, LiftCard, Reveal, Stagger } from "@/components/motion/Motion";

/* Linux-native download block — replaces the design's "Download for Mac".
   Wired to the same release data the /api/releases endpoint serves; while
   hosted artifact URLs are null it shows an honest early-access state
   instead of dead buttons. See Lectern-Brain/04-Linux-Native/Packaging & Distribution.md */

const RELEASES = "https://github.com/ShrimpScript/lectern/releases/latest";

// Download URLs derive from the latest release's version (releases[0]) so a new
// release only needs its entry added to lib/data/content — the buttons follow.
// Asset filenames carry the numeric version (Lectern_<x.y.z>_...), matching what
// the release build produces.
function packagesFor(ver: string) {
  const n = ver.replace(/^v/, ""); // "v0.6.0" -> "0.6.0"
  const REL = `https://github.com/ShrimpScript/lectern/releases/download/${ver}`;
  const note = `download ${ver} ↧`;
  return [
    {
      fmt: "AppImage",
      distro: "any distro",
      cmd: "chmod +x Lectern.AppImage && ./Lectern.AppImage",
      note,
      href: `${REL}/Lectern_${n}_amd64.AppImage`,
    },
    {
      fmt: ".deb",
      distro: "Debian / Ubuntu / Mint",
      cmd: "sudo apt install ./lectern.deb",
      note,
      href: `${REL}/Lectern_${n}_amd64.deb`,
    },
    {
      fmt: "CLI + daemon",
      distro: "terminal · any distro",
      cmd: `curl -fsSL ${REL}/lectern-cli-linux-x64.tar.gz | tar xz`,
      note,
      href: `${REL}/lectern-cli-linux-x64.tar.gz`,
      steps: "Unpacks the lectern and lecternd binaries — move them onto your PATH (e.g. ~/.local/bin), then run lectern doctor.",
    },
    {
      fmt: ".exe (unsigned)",
      distro: "Windows 10/11",
      cmd: `Lectern_${n}_x64-setup.exe`,
      note,
      href: `${REL}/Lectern_${n}_x64-setup.exe`,
      steps: "Unsigned: SmartScreen will warn — click “More info” → “Run anyway”. Built from this public repo by GitHub Actions.",
    },
    {
      fmt: ".dmg (unsigned)",
      distro: "macOS 13+ · Apple Silicon",
      cmd: `xattr -d com.apple.quarantine Lectern_${n}_aarch64.dmg`,
      note,
      href: `${REL}/Lectern_${n}_aarch64.dmg`,
      steps: "Unsigned: right-click the app → Open (or run the xattr line above). Built from this public repo by GitHub Actions.",
    },
  ];
}

export function Downloads() {
  const latest = releases[0];
  const PACKAGES = packagesFor(latest.version);
  return (
    <div id="download" className="container" style={{ padding: "88px 28px", borderBottom: "1px solid var(--bd2)" }}>
      <Reveal>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="kicker">Download</div>
            <h2 style={{ margin: "16px 0 4px", fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em" }}>
              Built for Linux, first.
            </h2>
            <p style={{ margin: 0, fontSize: 16, color: "var(--fg2)", maxWidth: 560 }}>
              A real native package — not a Mac port. {latest.version} · {latest.date}. Bring your own
              backend; keep your memory forever.
            </p>
          </div>
          <a
            target="_blank" rel="noreferrer"
            href={RELEASES}
            style={{
              fontSize: 12.5,
              fontWeight: 500,
              color: "var(--fg2)",
              border: "1px solid var(--bd)",
              borderRadius: 999,
              padding: "8px 14px",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--fg2)" }} />
            {latest.version} · all releases on GitHub
          </a>
        </div>
      </Reveal>

      <Stagger
        gap={0.09}
        style={{
          marginTop: 28,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        {PACKAGES.map((p) => {
          return (
            <Item key={p.fmt}>
              <LiftCard style={{ borderRadius: 12, padding: 18, height: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{p.fmt}</div>
                  <span style={{ fontSize: 11.5, fontWeight: 500, color: "var(--fg-dim)" }}>{p.distro}</span>
                </div>
                <div
                  className="mono"
                  style={{
                    marginTop: 10,
                    fontSize: 12.5,
                    color: "var(--term-fg)",
                    background: "var(--term-bg)",
                    border: "1px solid var(--bd2)",
                    borderRadius: 8,
                    padding: "9px 11px",
                    overflowX: "auto",
                  }}
                >
                  <span style={{ color: "var(--fg-dim)" }}>$ </span>
                  {p.cmd}
                </div>
                <div style={{ marginTop: 12, fontSize: 12 }}>
                  <a href={p.href} target="_blank" rel="noreferrer" style={{ color: "var(--fg)", borderBottom: "1px solid var(--bd)" }}>
                    {p.note}
                  </a>
                </div>
                {p.steps && (
                  <div style={{ marginTop: 8, fontSize: 11, lineHeight: 1.5, color: "var(--fg-dim)" }}>{p.steps}</div>
                )}
              </LiftCard>
            </Item>
          );
        })}
      </Stagger>
      <Reveal delay={0.1} y={12}>
        <div style={{ marginTop: 16, fontSize: 12.5, color: "var(--fg-dim)" }}>
          Windows &amp; macOS builds are unsigned, straight from public CI — verify any download against{" "}
          <a href="https://github.com/ShrimpScript/lectern/releases/latest/download/SHA256SUMS.txt" target="_blank" rel="noreferrer" style={{ color: "var(--fg2)", borderBottom: "1px solid var(--bd)" }}>SHA256SUMS.txt</a> on the release.
        </div>
      </Reveal>
    </div>
  );
}
