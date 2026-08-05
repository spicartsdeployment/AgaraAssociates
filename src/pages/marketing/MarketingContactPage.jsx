import { ContactHero } from "@/components/marketing/contact/ContactHero";
import { ContactIntro } from "@/components/marketing/contact/ContactIntro";
import { ContactMain } from "@/components/marketing/contact/ContactMain";
import { ContactLocation } from "@/components/marketing/contact/ContactLocation";
import { ContactProcess } from "@/components/marketing/contact/ContactProcess";
import { ContactBottom } from "@/components/marketing/contact/ContactBottom";
import "@/assets/styles/pages/MarketingContactPage.scss";

export default function MarketingContactPage() {
  return (
    <div className="marketing-contact-page">
      {/* <ContactHero />
      <ContactIntro /> */}
      <ContactMain />
      <ContactLocation />
      <ContactProcess />
      <ContactBottom />
    </div>
  );
}
