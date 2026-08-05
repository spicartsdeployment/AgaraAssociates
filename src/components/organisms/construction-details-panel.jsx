import { CONSTRUCTION_TYPE_OPTIONS, FOUNDATION_TYPE_OPTIONS, STRUCTURAL_SYSTEM_OPTIONS, CONSTRUCTION_METHOD_OPTIONS, } from "@/lib/constants/onboarding";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { formatCurrency } from "@/lib/utils";
import { HardHat, Building, Ruler, Wallet, Users, Calendar, Wrench, Shield, FileCheck } from "lucide-react";
import "@/assets/styles/components/ConstructionDetailsPanel.scss";

function labelFor(options, value) {
    return options.find((o) => o.value === value)?.label || value;
}

export function ConstructionDetailsPanel({ details, compact }) {
    if (compact) {
        return (<div className="construction-details-panel__compact">
        <Badge variant="secondary">{labelFor(CONSTRUCTION_TYPE_OPTIONS, details.constructionType)}</Badge>
        <Badge variant="outline">{details.numberOfFloors} floors</Badge>
        <Badge variant="outline">{details.builtUpArea.toLocaleString()} sqft</Badge>
        <Badge variant="outline">{labelFor(CONSTRUCTION_METHOD_OPTIONS, details.constructionMethod)}</Badge>
      </div>);
    }
    return (<Card className="construction-details-panel">
      <CardHeader>
        <CardTitle className="construction-details-panel__title">
          <HardHat className="construction-details-panel__title-icon"/> Construction Details
        </CardTitle>
      </CardHeader>
      <CardContent className="construction-details-panel__content">
        <div className="construction-details-panel__grid">
          <InfoItem icon={Building} label="Construction Type" value={labelFor(CONSTRUCTION_TYPE_OPTIONS, details.constructionType)}/>
          <InfoItem icon={Ruler} label="Built-up Area" value={`${details.builtUpArea.toLocaleString()} sqft`}/>
          <InfoItem icon={Ruler} label="Plot Area" value={`${details.plotArea.toLocaleString()} sqft`}/>
          <InfoItem icon={Building} label="Floors" value={String(details.numberOfFloors)}/>
          <InfoItem icon={Building} label="Foundation" value={labelFor(FOUNDATION_TYPE_OPTIONS, details.foundationType)}/>
          <InfoItem icon={Building} label="Structure" value={labelFor(STRUCTURAL_SYSTEM_OPTIONS, details.structuralSystem)}/>
          <InfoItem icon={Wrench} label="Method" value={labelFor(CONSTRUCTION_METHOD_OPTIONS, details.constructionMethod)}/>
          <InfoItem icon={Calendar} label="Mobilization" value={details.siteMobilizationDate}/>
        </div>

        <div className="construction-details-panel__grid construction-details-panel__grid--budget">
          <div className="construction-details-panel__stat-box">
            <div className="construction-details-panel__stat-label"><Wallet className="construction-details-panel__stat-label-icon"/> Total Budget</div>
            <p className="construction-details-panel__stat-value">{formatCurrency(details.estimatedConstructionBudget)}</p>
          </div>
          <div className="construction-details-panel__stat-box">
            <p className="construction-details-panel__stat-label">Material Budget</p>
            <p className="construction-details-panel__stat-value construction-details-panel__stat-value--md">{formatCurrency(details.materialBudget)}</p>
          </div>
          <div className="construction-details-panel__stat-box">
            <p className="construction-details-panel__stat-label">Labour Budget</p>
            <p className="construction-details-panel__stat-value construction-details-panel__stat-value--md">{formatCurrency(details.labourBudget)}</p>
          </div>
        </div>

        <div className="construction-details-panel__contractor">
          <div className="construction-details-panel__contractor-header"><Users className="construction-details-panel__contractor-icon"/><span className="construction-details-panel__contractor-title">Contractor</span></div>
          <p className="construction-details-panel__contractor-name">{details.contractor.company}</p>
          <p className="construction-details-panel__contractor-meta">{details.contractor.name} · {details.contractor.contact}</p>
          {details.contractor.license && <p className="construction-details-panel__contractor-license">License: {details.contractor.license}</p>}
        </div>

        <div className="construction-details-panel__grid construction-details-panel__grid--tags">
          <TagList icon={Wrench} title="Machinery" items={details.requiredMachinery}/>
          <TagList icon={FileCheck} title="Approvals" items={details.requiredApprovals}/>
          <TagList icon={Shield} title="Safety Compliance" items={details.safetyCompliance}/>
        </div>

        {details.milestones.length > 0 && (<div>
            <p className="construction-details-panel__milestones-title">Construction Milestones</p>
            <div className="construction-details-panel__milestones-list">
              {details.milestones.map((m, i) => (<div key={i} className="construction-details-panel__milestone">
                  <span className="construction-details-panel__milestone-title">{m.title}</span>
                  <span className="construction-details-panel__milestone-date">{m.targetDate}</span>
                </div>))}
            </div>
          </div>)}
      </CardContent>
    </Card>);
}

function InfoItem({ icon: Icon, label, value }) {
    return (<div className="construction-details-info">
      <div className="construction-details-info__label"><Icon className="construction-details-info__label-icon"/>{label}</div>
      <p className="construction-details-info__value">{value}</p>
    </div>);
}

function TagList({ icon: Icon, title, items }) {
    if (items.length === 0)
        return null;
    return (<div className="construction-details-tags">
      <div className="construction-details-tags__header"><Icon className="construction-details-tags__header-icon"/>{title}</div>
      <div className="construction-details-tags__list">
        {items.map((item) => (<Badge key={item} variant="outline" className="construction-details-tags__badge">{item}</Badge>))}
      </div>
    </div>);
}
