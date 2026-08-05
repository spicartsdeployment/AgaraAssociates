import { APP_LOGO, APP_NAME } from "@/lib/constants";
import "@/assets/styles/components/AppLogo.scss";

const sizes = {
  sm: { box: "sm", image: 32 },
  md: { box: "md", image: 36 },
  lg: { box: "lg", image: 48 },
  xl: { box: "xl", image: 64 },
};

export function AppLogo({
  size = "md",
  className,
  showName = false,
  tagline,
  variant = "default",
}) {
  const { box, image } = sizes[size];
  const rootClassName = ["app-logo", className].filter(Boolean).join(" ");

  return (
    <div className={rootClassName}>
      <div className={`app-logo__image-wrap app-logo__image-wrap--${box}`}>
        <img
          src={APP_LOGO}
          alt={`${APP_NAME} logo`}
          width={image}
          height={image}
          className="app-logo__image"
        />
      </div>
      {showName && (
        <div className="app-logo__text">
          <p
            className={`app-logo__name${variant === "light" ? " app-logo__name--light" : ""
              }`}
          >
            {APP_NAME}
          </p>
          {tagline && (
            <p
              className={`app-logo__tagline${variant === "light" ? " app-logo__tagline--light" : ""
                }`}
            >
              {tagline}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
