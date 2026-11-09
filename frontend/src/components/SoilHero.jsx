import { MdArrowForward, MdOutlineArrowOutward } from "react-icons/md";
import SoilHeroCarousel from "./SoilHeroCarousel/SoilHeroCarousel";

export default function SoilHero({ onExploreWorkflow, onDiscussPilot }) {
  return (
    <section
      aria-labelledby="terrafed-hero-title"
      className="relative isolate w-full overflow-clip rounded-[1.5rem] border border-[#DCE9E5] bg-[#F5F8F7] md:rounded-[2rem]"
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

      <div className="relative z-10 grid items-center gap-10 px-5 py-12 sm:px-9 md:gap-12 md:px-12 md:py-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14 lg:px-14 lg:py-10 xl:px-20">
        {/* Copy is intentionally independent of the preview, including on media failure. */}
        <div className="max-w-[39rem] text-left">
          <p className="mb-5 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase leading-relaxed tracking-[0.16em] text-[#00B029] sm:text-xs drop-shadow-sm">
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
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full drop-shadow-xl bg-[#00B029] px-6 py-3 text-sm font-bold text-[#062314] shadow-sm motion-safe:transition-colors motion-safe:duration-200 hover:bg-[#18CF43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008CD8]"
            >
              Explore the Workflow
              <MdArrowForward aria-hidden="true" size={17} />
            </button>
            <button
              type="button"
              onClick={onDiscussPilot}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full drop-shadow-xl border border-[#91B7C0] bg-white/90 px-6 py-3 text-sm font-bold text-[#0C2431] motion-safe:transition-colors motion-safe:duration-200 hover:border-[#008CD8] hover:bg-[#E9F5F8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008CD8]"
            >
              Join the Pilot Program
              <MdOutlineArrowOutward aria-hidden="true" size={17} />
            </button>
          </div>
        </div>

        <SoilHeroCarousel />
      </div>
    </section>
  );
}
