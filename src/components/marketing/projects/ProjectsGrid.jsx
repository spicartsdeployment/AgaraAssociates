import { memo } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/components/marketing/motion";
import { ProjectCard } from "@/components/cards/ProjectCard";
import "@/assets/styles/components/ProjectsGrid.scss";

function ProjectsGridComponent({ projects }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      className="projects-grid"
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </motion.div>
  );
}

export const ProjectsGrid = memo(ProjectsGridComponent);
