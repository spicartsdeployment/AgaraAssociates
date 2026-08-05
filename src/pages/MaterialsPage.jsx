import { Suspense } from "react";
import { MaterialLibraryClient, MaterialLibrarySkeleton } from "@/components/features/lazy-modules";
export function MaterialsPage() {
    return (<Suspense fallback={<MaterialLibrarySkeleton />}>
      <MaterialLibraryClient />
    </Suspense>);
}
