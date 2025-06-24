import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from "next/link"
import { login } from "@/app/lib/auth-actions"
export default function Login(){
    return (
    <div className="min-h-screen flex items-center justify-center p-4">
    <Card className="mx-auto w-full max-w-md p-6">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form action="">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
                <Button type="submit" formAction={login} className="w-full cursor-pointer hover:cursor-pointer">
                    Login
                </Button>
            </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up 
          </Link>
        </div>
        <div className="mt-4 text-center text-sm">
        {/* <Link href="#" className="ml-auto inline-block text-sm underline"> */}
                    Forgot your password?
                  {/* </Link> */}
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
