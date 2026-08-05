import { purchaseOrders, vendorQuotes } from "@/lib/mock/data";
import { PageHeader } from "@/components/templates/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import "@/assets/styles/pages/ProcurementPage.scss";

export function ProcurementPage() {
    return (<div className="procurement-page">
      <PageHeader title="Procurement" description="Purchase orders, vendor quotes, and delivery tracking"/>

      <Card className="procurement-page__callout">
        <CardContent className="procurement-page__callout-content">
          <ShoppingCart className="procurement-page__callout-icon"/>
          <p className="procurement-page__callout-text"><strong>Procurement Note:</strong> For vitrified tiles, Somany offers best value at ₹72/sqft with 4-day delivery. Hafele hinges — stick with original for warranty compliance.</p>
        </CardContent>
      </Card>

      <section className="procurement-page__section">
        <h2 className="procurement-page__section-title">Purchase Orders</h2>
        <div className="procurement-page__po-grid">
          {purchaseOrders.map((po) => (<Card key={po.id}>
              <CardContent className="procurement-page__po-content">
                <div className="procurement-page__po-header">
                  <div>
                    <p className="procurement-page__po-vendor">{po.vendor}</p>
                    <p className="procurement-page__po-project">{po.projectName}</p>
                  </div>
                  <Badge variant={po.status === "delivered" ? "success" : po.status === "ordered" ? "default" : "warning"}>
                    {po.status}
                  </Badge>
                </div>
                <div className="procurement-page__po-meta">
                  <span>{po.items} items</span>
                  <span className="procurement-page__po-amount">{formatCurrency(po.amount)}</span>
                </div>
                <p className="procurement-page__po-delivery">Delivery: {po.deliveryDate}</p>
              </CardContent>
            </Card>))}
        </div>
      </section>

      <section className="procurement-page__section">
        <h2 className="procurement-page__section-title">Vendor Comparison</h2>
        <Card>
          <CardContent className="procurement-page__table-content">
            <table className="procurement-page__table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Vendor</th>
                  <th>Price</th>
                  <th>Delivery</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {vendorQuotes.map((vq, i) => (<tr key={i}>
                    <td>{vq.material}</td>
                    <td className="procurement-page__vendor-cell">{vq.vendor}</td>
                    <td>₹{vq.price}</td>
                    <td>{vq.deliveryDays} days</td>
                    <td>★ {vq.rating}</td>
                  </tr>))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      <div className="procurement-page__stats-grid">
        <Card>
          <CardHeader><CardTitle className="procurement-page__stat-title">Pending Orders</CardTitle></CardHeader>
          <CardContent>
            <p className="procurement-page__stat-value">{purchaseOrders.filter((p) => p.status === "pending").length}</p>
            <p className="procurement-page__stat-label">Awaiting confirmation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="procurement-page__stat-title">Warehouse Status</CardTitle></CardHeader>
          <CardContent>
            <p className="procurement-page__stat-value">78%</p>
            <p className="procurement-page__stat-label">Storage capacity utilized</p>
          </CardContent>
        </Card>
      </div>
    </div>);
}
