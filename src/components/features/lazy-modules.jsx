import { lazy } from "react";
import { MaterialLibrarySkeleton } from "@/components/ui/route-skeletons";
export const MaterialLibraryClient = lazy(() => import("@/components/organisms/material-library/material-library").then((mod) => ({
    default: mod.MaterialLibrary,
})));
export const BoqWizardClient = lazy(() => import("@/components/organisms/boq/boq-quantity-takeoff-wizard").then((mod) => ({
    default: mod.BoqQuantityTakeoffWizard,
})));
export { MaterialLibrarySkeleton };
