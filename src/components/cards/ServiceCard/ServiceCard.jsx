import "./ServiceCard.scss";

export function ServiceCard({ icon: Icon, title, desc, item }) {
  const resolvedTitle = title ?? item?.title;
  const resolvedDesc = desc ?? item?.desc;

  return (
    <div className="services-section__item">
      <Icon className="services-section__item-icon" strokeWidth={1} aria-hidden />
      <h3 className="services-section__item-title">{resolvedTitle}</h3>
      <p className="services-section__item-desc">{resolvedDesc}</p>
    </div>
  );
}

export default ServiceCard;
