import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Label } from "@/components/common/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/common/Card";
import "@/assets/styles/pages/SignupPage.scss";

export function SignupPage() {
    const navigate = useNavigate();
    return (<Card className="signup-page__card">
      <CardHeader className="signup-page__header">
        <CardTitle className="signup-page__title">Create your studio</CardTitle>
        <CardDescription>Start your 14-day free trial</CardDescription>
      </CardHeader>
      <CardContent className="signup-page__content">
        <form onSubmit={(e) => {
            e.preventDefault();
            navigate("/login");
        }} className="signup-page__form">
          <div className="signup-page__field">
            <Label htmlFor="studio">Studio Name</Label>
            <Input id="studio" placeholder="Atelier Design Co."/>
          </div>
          <div className="signup-page__field">
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" placeholder="Rahul Sharma"/>
          </div>
          <div className="signup-page__field">
            <Label htmlFor="role">Role</Label>
            <select id="role" className="signup-page__select">
              <option>Architect</option>
              <option>Interior Designer</option>
              <option>Construction Consultant</option>
            </select>
          </div>
          <div className="signup-page__field">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@studio.com"/>
          </div>
          <div className="signup-page__field">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password"/>
          </div>
          <Button type="submit" className="signup-page__submit">
            Create account
          </Button>
        </form>
        <p className="signup-page__footer">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </CardContent>
    </Card>);
}
