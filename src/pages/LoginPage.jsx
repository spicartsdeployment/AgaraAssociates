import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Label } from "@/components/common/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/common/Card";
import { toast } from "sonner";
import { findUserByCredentials } from "@/lib/auth/users";
import { setSessionCookie, signSession } from "@/lib/auth/session";
import "@/assets/styles/pages/LoginPage.scss";

export function LoginPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get("redirect") || "/dashboard";
    const [loading, setLoading] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        const form = new FormData(e.currentTarget);
        const email = String(form.get("email") ?? "");
        const password = String(form.get("password") ?? "");
        try {
            const user = findUserByCredentials(email, password);
            if (!user) {
                toast.error("Invalid email or password.");
                return;
            }
            const token = await signSession({
                userId: user.id,
                email: user.email,
                name: user.name,
            });
            setSessionCookie(token);
            toast.success("Welcome back to ArchiFlow.");
            navigate(redirect, { replace: true });
        }
        catch {
            toast.error("Unable to sign in.");
        }
        finally {
            setLoading(false);
        }
    }
    return (<Card className="login-page__card">
      <CardHeader className="login-page__header">
        <CardTitle className="login-page__title">Welcome back</CardTitle>
        <CardDescription>Sign in to your ArchiFlow workspace</CardDescription>
      </CardHeader>
      <CardContent className="login-page__content">
        <form onSubmit={handleSubmit} className="login-page__form">
          <div className="login-page__field">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@studio.com" defaultValue="adarsh@agaraassociates.com" required/>
          </div>
          <div className="login-page__field">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" defaultValue="agara2026" required/>
          </div>
          <Button type="submit" className="login-page__submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <p className="login-page__footer">
          Don&apos;t have an account?{" "}
          <Link to="/signup">Create one</Link>
        </p>
      </CardContent>
    </Card>);
}
