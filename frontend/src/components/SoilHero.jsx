import { useState } from "react";
import { MdArrowForward, MdOutlineArrowOutward } from "react-icons/md";
import { mediaAssets } from "../data/mediaAssets";

// The two screenshots below are cropped from the existing TerraFed dashboard
// images. The third stage intentionally does not imply an implemented feature
// or present a fabricated uncertainty/sampling output.
const previewStages = [
  {
    number: "01",
    label: "Define the area",
    image: mediaAssets.fieldBoundary.src,
    alt: mediaAssets.fieldBoundary.alt,
  },
  {
    number: "02",
    label: "Baseline soil map",
    image: mediaAssets.baselineMap.src,
    alt: mediaAssets.baselineMap.alt,
  },
];

function PreviewImage({ src, alt }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative aspect-[1.55] overflow-hidden bg-[#E7EFEC]">
      {failed ? (
        <div className="flex h-full items-center justify-center px-4 text-center text-xs font-medium text-[#35535F]">
          Dashboard preview unavailable
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          width="780"
          height="510"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}

export default function SoilHero({ onExploreWorkflow, onDiscussPilot }) {
  return (
    <section
      aria-labelledby="terrafed-hero-title"
      className="relative isolate w-full overflow-hidden rounded-[1.5rem] border border-[#DCE9E5] bg-[#F5F8F7] md:rounded-[2rem]"
    >
      {/* CSS-only accents: the headline is readable even without any media. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-[-15rem] h-[28rem] w-[28rem] rounded-full bg-[#00B029]/[0.055] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10rem] top-[-13rem] h-[30rem] w-[30rem] rounded-full bg-[#008CD8]/[0.055] blur-3xl"
      />

      <div className="relative z-10 grid items-center gap-10 px-5 py-12 sm:px-9 md:gap-12 md:px-12 md:py-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14 lg:px-14 lg:py-20 xl:px-20">
        {/* Copy is intentionally independent of the preview, including on media failure. */}
        <div className="max-w-[39rem] text-left">
          <p className="mb-5 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase leading-relaxed tracking-[0.16em] text-[#176D48] sm:text-xs">
            <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[#00B029]" />
            PRIVACY-PRESERVING SOIL INTELLIGENCE
          </p>
          <h1
            id="terrafed-hero-title"
            className="!m-0 !text-[clamp(2.15rem,4.25vw,4.35rem)] !font-bold !leading-[1.09] !tracking-[-0.045em] !text-[#0C2431]"
          >
            Shared soil intelligence. Locally adapted. Privacy governed.
          </h1>
          <p className="mt-6 max-w-[35rem] text-[0.98rem] leading-[1.8] text-[#405963] sm:text-[1.08rem]">
            TerraFed helps agricultural organizations turn Earth observation and local measurements into uncertainty-aware soil maps without centralizing sensitive observations.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={onExploreWorkflow}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#00B029] px-6 py-3 text-sm font-bold text-[#062314] shadow-sm motion-safe:transition-colors motion-safe:duration-200 hover:bg-[#18CF43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008CD8]"
            >
              Explore the Workflow
              <MdArrowForward aria-hidden="true" size={17} />
            </button>
            <button
              type="button"
              onClick={onDiscussPilot}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#91B7C0] bg-white/90 px-6 py-3 text-sm font-bold text-[#0C2431] motion-safe:transition-colors motion-safe:duration-200 hover:border-[#008CD8] hover:bg-[#E9F5F8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008CD8]"
            >
              Discuss a Pilot
              <MdOutlineArrowOutward aria-hidden="true" size={17} />
            </button>
          </div>
        </div>

        {/* Static storyboard replaces the previous dark WebGL hero. A future
            video could replace this panel while retaining it as the poster. */}
        <div
          aria-label="TerraFed product workflow storyboard"
          className="min-w-0 overflow-hidden rounded-[1.4rem] border border-[#D5E4E3] bg-white shadow-[0_18px_55px_-35px_rgba(12,36,49,0.45)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8EFEE] px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2 text-xs font-bold tracking-[0.08em] text-[#163E4B]">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#00B029]" />
              TERRAFED WORKFLOW
            </div>
            <span className="rounded-full bg-[#F0F5F3] px-2.5 py-1 text-[0.65rem] font-semibold text-[#54726A]">
              Static poster fallback · existing dashboard previews
            </span>
          </div>

          <div className="grid gap-3 p-3 sm:grid-cols-2 sm:p-4">
            {previewStages.map((stage) => (
              <figure
                key={stage.number}
                className="min-w-0 overflow-hidden rounded-xl border border-[#E0EAE6] bg-white"
              >
                <PreviewImage src={stage.image} alt={stage.alt} />
                <figcaption className="flex items-center gap-2 px-3 py-3 text-left">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#E6F6E9] text-[0.68rem] font-bold text-[#087B30]">
                    {stage.number}
                  </span>
                  <span className="text-xs font-semibold text-[#153641] sm:text-[0.79rem]">
                    {stage.label}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mx-3 mb-3 flex items-center gap-3 rounded-xl border border-dashed border-[#A9C8C1] bg-[#F5FAF7] p-3 text-left sm:mx-4 sm:mb-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E5F3ED] text-xs font-bold text-[#087B30]">
              03
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#153641] sm:text-sm">
                Uncertainty &amp; next samples
              </p>
              <p className="mt-0.5 text-[0.69rem] leading-5 text-[#435B66]">
                Planned · Verified uncertainty and sampling visuals pending
              </p>
            </div>
            <span aria-hidden="true" className="hidden text-[#2F86B7] sm:block">
              <MdArrowForward size={19} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
