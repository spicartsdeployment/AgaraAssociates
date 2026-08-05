"use client";
import { Link } from "react-router-dom";
import { getBoqsForClient } from "@/lib/client-workspace";
import { Card, CardContent } from "@/components/common/Card";
import { ClipboardList } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { calculateBoqEstimate } from "@/lib/boq/estimate-calculator";
import "@/assets/styles/components/BoqClientView.scss";

export function BoqClientView({ clientId }) {
    const boqs = getBoqsForClient(clientId);
    if (boqs.length === 0) {
        return (
            <Card className="boq-client-view__empty">
                <CardContent className="boq-client-view__empty-content">
                    <p className="boq-client-view__empty-title">No BOQs for this client</p>
                    <p className="boq-client-view__empty-text">Create a project or add a BOQ linked to this client&apos;s work.</p>
                </CardContent>
            </Card>
        );
    }
    return (
        <div className="boq-client-view__grid">
            {boqs.map((boq) => (
                <Link key={boq.id} to={`/boq/${boq.id}?client=${clientId}`}>
                    <Card className="boq-client-view__card">
                        <CardContent className="boq-client-view__card-content">
                            <div className="boq-client-view__card-header">
                                <div className="boq-client-view__card-icon-wrap">
                                    <ClipboardList className="boq-client-view__card-icon" />
                                </div>
                                <div>
                                    <h3 className="boq-client-view__card-title">{boq.title}</h3>
                                    <p className="boq-client-view__card-project">{boq.projectName}</p>
                                </div>
                            </div>
                            <div className="boq-client-view__card-stats">
                                <span className="boq-client-view__card-items">{boq.items.length} line items</span>
                                <span className="boq-client-view__card-total">{formatCurrency(calculateBoqEstimate(boq.items).grandTotal)}</span>
                            </div>
                            <p className="boq-client-view__card-updated">Updated {boq.updatedAt}</p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
