import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { project_info } from "@/constants";
import { fadeUp } from "@/components/marketing/motion";
import SocialSidebar from "@/components/navigation/SocialSidebar";
import { VideoModal } from "@/components/modals/VideoModal";
import { FeaturedProjectCard } from "@/components/cards/FeaturedProjectCard";
import "./HeroSection.scss";

const featuredProject = project_info?.[0] ?? null;

export function HeroSection() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <section className="hero-section">
      <div className="hero-section__bg">
        <img
          src="/HeroImage.png"
          loading="eager"
          alt="Casa Aranya — luxury residence by AGARA Architects"
          className="hero-section__bg-image"
        />
      </div>

      {/* <SocialSidebar /> */}

      <div className="hero-section__featured-wrap">
        <FeaturedProjectCard onPlayClick={() => setVideoModalOpen(true)} />
      </div>

      <div className="hero-section__content-wrap">
        <motion.div
          className="hero-section__content"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <p className="hero-section__eyebrow">
            Every Project Starts With A Story
          </p>
          <h1 className="hero-section__title">
            Designing Spaces
            <br />
            That Endure
          </h1>
          <p className="hero-section__description">
            We craft architectural and interior environments defined by
            proportion, material honesty, and timeless design language.
          </p>
          <div className="hero-section__actions">
            <Link to="/projects" className="hero-section__cta">
              Begin Your Journey
              <ArrowRight
                className="hero-section__cta-icon"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </motion.div>
      </div>

      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoSrc="/videos/casa-aranya.mp4"
        title={featuredProject?.title || "Featured Project"}
        location={featuredProject?.subTittle || "Hyderabad, India"}
      />
    </section>
  );
}

export default HeroSection;
