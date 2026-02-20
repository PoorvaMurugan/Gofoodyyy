import HeroCarousel from "@/components/home/HeroCarousel";
import CategoriesSection from "@/components/sections/categories/CategoriesSection";
import FeaturedDishesSection from "@/components/sections/dishes/FeaturedDishesSection";
import OffersSection from "@/components/sections/offers/OffersSection";
import WhyChooseUsSection from "@/components/sections/about/WhyChooseUsSection";

type SectionType =
  | "hero"
  | "categories"
  | "featured"
  | "offers"
  | "whyChooseUs";

interface HomepageSection {
  id: number;
  type: SectionType;
  order: number;
  isVisible: boolean;
  data: any;
}

// Temporary mock — replace with Convex query later
async function getHomepageSections(): Promise<HomepageSection[]> {
  return [
    { id: 1, type: "hero", order: 1, isVisible: true, data: {} },
    { id: 2, type: "categories", order: 2, isVisible: true, data: {} },
    { id: 3, type: "featured", order: 3, isVisible: true, data: {} },
    { id: 4, type: "offers", order: 4, isVisible: true, data: {} },
    { id: 5, type: "whyChooseUs", order: 5, isVisible: true, data: {} },
  ];
}

export default async function Home() {
  const sections = await getHomepageSections();

  const visibleSections = sections
    .filter((section) => section.isVisible)
    .sort((a, b) => a.order - b.order);

  return (
    <main className="flex flex-col">
      {visibleSections.map((section) => {
        switch (section.type) {
          case "hero":
            return (
              <HeroCarousel
                key={section.id}
                data={section.data}
              />
            );

          case "categories":
            return (
              <section
                key={section.id}
                className="container mx-auto px-6 lg:px-16 py-16"
              >
                <CategoriesSection data={section.data} />
              </section>
            );

          case "featured":
            return (
              <section
                key={section.id}
                className="container mx-auto px-6 lg:px-16 py-16"
              >
                <FeaturedDishesSection data={section.data} />
              </section>
            );

          case "offers":
            return (
              <section
                key={section.id}
                className="container mx-auto px-6 lg:px-16 py-16"
              >
                <OffersSection data={section.data} />
              </section>
            );

          case "whyChooseUs":
            return (
              <section
                key={section.id}
                className="container mx-auto px-6 lg:px-16 py-16"
              >
                <WhyChooseUsSection data={section.data} />
              </section>
            );

          default:
            return null;
        }
      })}
    </main>
  );
}