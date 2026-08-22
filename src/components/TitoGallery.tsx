/**
 * A hover-expand strip of four photographs, under the WhatsApp link in the
 * GDR section.
 *
 * WHY THESE PHOTOS EARN THE SPACE. The page already claims "15 countries"
 * twice (HeroSection, DifferentiatorsSection) and the funnel pages expand it
 * to "studying how people in different economies build wealth". Until now that
 * was an assertion with nothing behind it. These are the evidence, so the
 * caption reuses the site's own wording rather than inventing a new claim.
 *
 * NO WEBP SOURCES, AND THAT IS NOT AN OVERSIGHT. Every other image in
 * public/images ships -xs/-sm/-md.webp variants generated ahead of time. These
 * four arrived as .jpeg only, and neither cwebp nor sips on this machine can
 * write webp, so there is nothing for a <source> to point at. A <picture> with
 * no <source> is just an <img> with extra markup, so this is an <img>. When
 * the variants are generated, wrapping each one in <picture> with a single
 * <source srcSet=... type="image/webp"> is the whole change - the sizes are
 * already correct below.
 *
 * INTRINSIC SIZE IS SET ON EVERY IMAGE. width/height come from the real files
 * so the browser reserves the box before the bytes land; without them a strip
 * of four lazy images shifts the whole left column as they arrive, which is
 * the CLS this section would otherwise pay for.
 */

/**
 * Real dimensions, read off the files. Three portraits and one landscape, so
 * each frame crops - and the crop is per-image rather than a blanket "center",
 * because a centred crop of a narrow panel cuts the subject out of frames 1
 * and 2, where he stands well off-centre.
 */
const GALLERY = [
  {
    src: '/images/titobi-gallery-1.jpeg',
    alt: 'Titobi Oreolorun outside the Moulin Rouge in Paris',
    width: 810,
    height: 1080,
    // He stands right of centre with his arm raised.
    position: '62% 45%',
  },
  {
    src: '/images/titobi-gallery-2.jpeg',
    alt: 'Titobi Oreolorun seated by a window overlooking a city waterfront',
    width: 954,
    height: 1080,
    // Seated left of centre, facing the camera.
    position: '34% 40%',
  },
  {
    src: '/images/titobi-gallery-3.jpeg',
    alt: 'Titobi Oreolorun at an LVMH event',
    width: 1080,
    height: 720,
    // The only landscape frame, so it loses the most width. His face sits just
    // right of centre and the LVMH lettering behind him reads either side.
    position: '55% 40%',
  },
  {
    src: '/images/titobi-gallery-4.jpeg',
    alt: 'Titobi Oreolorun outside the United States Capitol in Washington, DC',
    width: 810,
    height: 1080,
    position: '58% 45%',
  },
]

export default function TitoGallery() {
  return (
    <div className="mt-10">
      <p
        className="mb-3 text-[13px]"
        style={{
          fontFamily: 'DM Sans, sans-serif',
          color: '#6B6B6B',
          letterSpacing: '0.01em',
        }}
      >
        15 countries, studying how people build wealth.
      </p>

      {/*
        TWO LAYOUTS, AND THE BREAKPOINT IS THE MOBILE FALLBACK.

        Below md this is a plain 2x2 grid: four equal tiles, all four visible,
        nothing depending on hover. A hover-expand row on a phone is either
        dead - no pointer ever hovers - or worse, sticky: the first tap latches
        :hover on one panel and it stays expanded until something else is
        tapped, which reads as a bug.

        At md and up it becomes the strip. The expand is additionally gated on
        (hover: hover), so a touch tablet at that width keeps four equal panels
        rather than inheriting the same sticky-hover problem. Pointer devices
        are the only ones that get the interaction, which is the only place it
        means anything.

        Nothing here is JavaScript. No state, no framer-motion, no listener -
        the row is CSS flex-grow under a hover selector, so it works with JS
        disabled and costs nothing at runtime.
      */}
      {/*
        HEIGHT SCALES WITH THE BREAKPOINT because the panel WIDTH is not free.
        This strip sits in one half of a two-column grid, so a collapsed panel
        is (column - 24) / 4 - about 82px at 820 and 160px at 1440. A single
        fixed height therefore reads completely differently across the range:
        300px made 82x300 matchsticks at 820 while barely denting the gap at
        1440.

        The ladder holds each panel near a 0.35-0.40 ratio instead, so the
        strip grows with the space it has rather than against it:

          820   82x240   0.34      1280  140x400  0.35
          1024 108x300   0.36      1440  160x400  0.40

        400 at xl is not arbitrary. A HOVERED panel takes 2.5 of 5.5 shares -
        302px at 1440 - and 302/400 is 0.75, the native ratio of three of the
        four photographs. The expanded state is the one that shows the picture,
        so that is the state worth fitting; at the old 220px it was 1.37, a
        landscape window onto a portrait photo.

        Below md none of this applies: the 2x2 grid is aspect-[3/4] and
        untouched.
      */}
      <div className="grid grid-cols-2 gap-2 md:flex md:h-[240px] md:gap-2 lg:h-[300px] xl:h-[400px]">
        {GALLERY.map((photo) => (
          <figure
            key={photo.src}
            className="group relative aspect-[3/4] overflow-hidden rounded-2xl md:aspect-auto md:h-full md:flex-1 md:transition-all md:duration-500 md:ease-out md:[@media(hover:hover)]:hover:flex-[2.5_1_0%]"
            style={{ background: '#1A3A16' }}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="h-full w-full object-cover transition-transform duration-500 ease-out md:[@media(hover:hover)]:group-hover:scale-[1.04]"
              style={{ objectPosition: photo.position }}
            />

            {/*
              A forest wash that lifts on hover. The collapsed panels sit back
              so the expanded one reads as the subject, rather than four
              equally-lit tiles competing. Ink at the foot keeps the bottom
              edge from cutting hard against the ivory ground.
            */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out md:[@media(hover:hover)]:group-hover:opacity-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(13,11,8,0.42) 0%, rgba(26,58,22,0.22) 55%, rgba(26,58,22,0.10) 100%)',
              }}
            />

            {/* Gold hairline, inset so it reads as a frame rather than a
                border on the layout box. Brightens with the panel. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl transition-colors duration-500 ease-out"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(201,168,76,0.28)' }}
            />
          </figure>
        ))}
      </div>
    </div>
  )
}
