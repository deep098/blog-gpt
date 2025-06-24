import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
export default function SignUpConfirm(){
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <Card className="w-full max-w-md p-6 text-center shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-600 text-xl">Almost there!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              We've sent a confirmation email
              <br />
              Please click the link in your inbox to verify your account.
            </p>
          </CardContent>
        </Card>
        </div>
    )
}