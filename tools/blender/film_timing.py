"""Film timing shared by the ground painter, the Blender scene and the frame driver.

Mirrors filmPhase() in components/home/film-timing.ts: a short hold on today, then three eased phases.
"""
FRAMES = 72
HOLD = 0.1  # share of the film that holds on today
SPAN = 0.82  # share over which the three phases build
PHASES = 3
LEGEND_LEAD = 0.25  # FilmPlayer marks a phase active once f passes k - 1 + this


def smooth(x):
    return x * x * (3 - 2 * x)


def clamp01(x):
    return max(0.0, min(1.0, x))


def film_phase(p):
    u = clamp01((p - HOLD) / SPAN) * PHASES
    k = min(PHASES - 1, int(u // 1))
    return float(PHASES) if u >= PHASES else k + smooth(min(1.0, u - k))


def frame_fa(i, n=FRAMES):
    """(phase f, camera progress a) for frame i, exactly as tools/film/render-frames.cjs computed them."""
    s = i / (n - 1)
    return film_phase(s), s


def legend_phase(f):
    """The phase FilmPlayer highlights in the legend at phase f."""
    return 0 if f < LEGEND_LEAD else min(PHASES, -int(-(f - LEGEND_LEAD) // 1))


if __name__ == "__main__":
    # Acceptance checkpoints: 10, 35, 62 and 95 per cent of the film show phases 0, 1, 2 and 3.
    for pct, want in [(10, 0), (35, 1), (62, 2), (95, 3)]:
        i = round(pct / 100 * (FRAMES - 1))
        f, _ = frame_fa(i)
        assert legend_phase(f) == want, (pct, i, f, legend_phase(f))
        print(f"{pct}% frame {i:02d} f={f:.3f} legend={legend_phase(f)}")
