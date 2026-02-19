import HeroCarousel from "@/components/home/HeroCarousel";
import CategoriesSection from "@/components/sections/categories/CategoriesSection";
import FeaturedDishesSection from "@/components/sections/dishes/FeaturedDishesSection";
import OffersSection from "@/components/sections/offers/OffersSection";
import WhyChooseUsSection from "@/components/sections/about/WhyChooseUsSection";

export default function Home() {
  return (
    <div>
      <HeroCarousel />
      <CategoriesSection />
      <FeaturedDishesSection />
      <OffersSection />
      <WhyChooseUsSection />
    </div>
  );
}
