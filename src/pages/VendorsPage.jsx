import { vendorQuotes } from "@/lib/mock/data";
import { PageHeader } from "@/components/templates/page-header";
import { Card, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import "@/assets/styles/pages/VendorsPage.scss";

const vendors = [...new Map(vendorQuotes.map((v) => [v.vendor, v])).values()];
export function VendorsPage() {
    return (<div className="vendors-page">
      <PageHeader title="Vendors" description="Your trusted supplier network"/>

      <div className="vendors-page__grid">
        {vendors.map((v) => (<Card key={v.vendor}>
            <CardContent className="vendors-page__card-content">
              <div className="vendors-page__card-header">
                <h3 className="vendors-page__vendor-name">{v.vendor}</h3>
                <Badge variant="secondary">★ {v.rating}</Badge>
              </div>
              <p className="vendors-page__delivery">Avg. delivery: {v.deliveryDays} days</p>
              <div>
                <p className="vendors-page__quote-label">Recent quote</p>
                <p className="vendors-page__quote-value">{v.material} — ₹{v.price}</p>
              </div>
            </CardContent>
          </Card>))}
        {["Kajaria Ceramics", "Asian Paints", "Greenply Industries", "Jaquar", "Godrej Interio"].map((name) => {
            if (vendors.some((v) => v.vendor === name))
                return null;
            return (<Card key={name}>
              <CardContent className="vendors-page__card-content vendors-page__card-content--compact">
                <h3 className="vendors-page__vendor-name vendors-page__vendor-name--md">{name}</h3>
                <p className="vendors-page__placeholder-text">Preferred vendor</p>
                <Badge variant="outline">Active</Badge>
              </CardContent>
            </Card>);
        })}
      </div>
    </div>);
}
