"use client";
import { useState } from "react";
import { toast } from "sonner";
import { CURRENT_USER, CURRENT_STUDIO } from "@/lib/constants";
import { getTeamMembers, getStudioSettingsSnapshot, updateStudioSettings } from "@/lib/store/team-store";
import { PageHeader } from "@/components/templates/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Label } from "@/components/common/Label";
import { Badge } from "@/components/common/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/common/Avatar";
import { getInitials } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import "@/assets/styles/components/SettingsForm.scss";

export function SettingsForm() {
    const initial = getStudioSettingsSnapshot();
    const [studioName, setStudioName] = useState(initial.studioName);
    const [email, setEmail] = useState(initial.email);
    const [phone, setPhone] = useState(initial.phone);
    const team = getTeamMembers();
    const handleSave = () => {
        updateStudioSettings({ studioName, email, phone });
        toast.success("Settings saved");
    };
    return (<div className="settings-form">
      <PageHeader title="Settings" description="Manage your studio profile and preferences"/>

      <Card>
        <CardHeader><CardTitle>Your Profile</CardTitle></CardHeader>
        <CardContent className="settings-form__profile-content">
          <Avatar className="settings-form__profile-avatar">
            <AvatarImage src={CURRENT_USER.avatar} alt={CURRENT_USER.name}/>
            <AvatarFallback>{getInitials(CURRENT_USER.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="settings-form__profile-name">{CURRENT_USER.name}</p>
            <p className="settings-form__profile-role">{CURRENT_USER.role}</p>
            <p className="settings-form__profile-role">{CURRENT_STUDIO}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Studio Profile</CardTitle></CardHeader>
        <CardContent className="settings-form__studio-content">
          <div className="settings-form__field">
            <Label>Studio Name</Label>
            <Input value={studioName} onChange={(e) => setStudioName(e.target.value)}/>
          </div>
          <div className="settings-form__field">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="settings-form__field">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)}/>
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Team Members</CardTitle></CardHeader>
        <CardContent className="settings-form__team-content">
          {team.map((member) => (<div key={member.id} className="settings-form__team-member">
              <Avatar>
                {member.avatar ? <AvatarImage src={member.avatar} alt={member.name}/> : null}
                <AvatarFallback className="settings-form__team-avatar-fallback">{getInitials(member.name)}</AvatarFallback>
              </Avatar>
              <div className="settings-form__team-info">
                <p className="settings-form__team-name">{member.name}</p>
                <p className="settings-form__team-role">{member.role}</p>
              </div>
              <Badge variant="outline">Active</Badge>
            </div>))}
          <Button variant="outline" className="settings-form__invite-btn" onClick={() => toast.info("Invite link copied to clipboard")}>
            Invite Team Member
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Integrations</CardTitle></CardHeader>
        <CardContent className="settings-form__integrations">
          <div className="settings-form__integration-row">
            <div className="settings-form__integration-main">
              <MessageCircle className="settings-form__integration-icon"/>
              <div>
                <p className="settings-form__integration-name">WhatsApp Business</p>
                <p className="settings-form__integration-desc">Sync client messages</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.info("WhatsApp integration setup started")}>Connect</Button>
          </div>
          <div className="settings-form__integration-row">
            <div>
              <p className="settings-form__integration-name">Tally ERP</p>
              <p className="settings-form__integration-desc">Accounting sync</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.info("Tally connection wizard opened")}>Connect</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="settings-form__billing-card">
        <CardHeader><CardTitle>Billing Plan</CardTitle></CardHeader>
        <CardContent>
          <div className="settings-form__billing-row">
            <div>
              <p className="settings-form__billing-name">Professional Plan</p>
              <p className="settings-form__billing-meta">₹4,999/month · Up to 15 projects</p>
            </div>
            <Badge>Active</Badge>
          </div>
          <Button variant="outline" className="settings-form__billing-btn" onClick={() => toast.info("Subscription portal opened")}>Manage Subscription</Button>
        </CardContent>
      </Card>
    </div>);
}
