import HeroSection from "./sections/HeroSection";
import ValuePropsSection from "./sections/ValuePropsSection";

/**
 * Renders a homepage from its saved configuration.
 *
 * The map is the only place a section type meets its component; everything else
 * works from the registry in lib/home-page/sections.js. A type with no
 * component here renders nothing rather than breaking the page, which is what
 * happens if a section is added to the registry before its component exists.
 *
 * Server component, like the sections it renders — see HeroSection for why that
 * matters on this page in particular.
 */
const COMPONENTS = {
  hero: HeroSection,
  valueProps: ValuePropsSection,
};

export default function ConfiguredHomePage({ sections = [] }) {
  const visible = sections.filter((s) => s?.visible !== false && COMPONENTS[s?.type]);

  return (
    <>
      {visible.map((section, index) => {
        const Section = COMPONENTS[section.type];
        // `index` tells a section whether it is the one above the fold: the
        // first section loads its image eagerly, the rest do not.
        return <Section key={section.id} section={section} index={index} />;
      })}
    </>
  );
}
