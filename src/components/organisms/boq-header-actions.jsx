"use client";
import { Button } from "@/components/common/Button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import "@/assets/styles/components/BoqHeaderActions.scss";

export function BoqHeaderActions({ clientId }) {
    return (
        <Button className="boq-header-actions__btn" asChild>
            <Link to={`/boq/new?client=${clientId}`}>
                <Plus className="boq-header-actions__icon" /> New BOQ Takeoff
            </Link>
        </Button>
    );
}
