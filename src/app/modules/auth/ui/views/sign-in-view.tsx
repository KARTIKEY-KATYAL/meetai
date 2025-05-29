"use client"
import Image from "next/image";
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Card , CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { OctagonAlert } from "lucide-react" 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const SignInView = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [socialLoading, setSocialLoading] = useState<string | null>(null);

    const router = useRouter()

    const formSchema = z.object({
        email : z.string().email({message: "Please enter a valid email address"}),
        password : z.string().min(1, {message: "Password is required"})
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            email:"",
            password:""
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            setError(null);

            const result = await authClient.signIn.email({
                email: data.email,
                password: data.password,
            });

            if (result.data) {
                router.push("/");
            }
            
        } catch (err: any) {
            console.error("Signin error:", err);
            setError(err?.error?.message || "Invalid credentials");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialSignIn = async (provider: 'google' | 'github') => {
        try {
            setSocialLoading(provider);
            setError(null);

            if (provider === 'google') {
                await authClient.signIn.social({
                    provider: 'google',
                    callbackURL: '/',
                });
            } else if (provider === 'github') {
                await authClient.signIn.social({
                    provider: 'github',
                    callbackURL: '/',
                });
            }
        } catch (err: any) {
            console.error(`${provider} sign-in error:`, err);
            setError(err?.error?.message || `Failed to sign in with ${provider}`);
        } finally {
            setSocialLoading(null);
        }
    };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center ">
                    <h1 className="text-2xl font-bold">
                        Welcome Back
                    </h1>
                    <p className="text-muted-foreground text-balance">
                        Sign In to SuperMeet
                    </p>
                </div>
                <div className="grid gap-3">
                    <FormField 
                        control={form.control}
                        name="email"
                        render={({field})=> (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                     type="email"
                                     placeholder="m@SuperMeet.com"
                                     {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid gap-3">
                    <FormField 
                        control={form.control}
                        name="password"
                        render={({field})=> (
                            <FormItem>
                                <div className="flex items-center justify-between">
                                    <FormLabel>Password</FormLabel>
                                    <Link 
                                        href="/forgot-password" 
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <FormControl>
                                    <Input
                                     type="password"
                                     placeholder="Enter your password"
                                     {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            {!!error && (
                <Alert className="bg-destructive/10 border-none mt-4">
                    <OctagonAlert className="w-4 h-4 !text-destructive"/>
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <Button
                type="submit"
                className="w-full mt-6"
                disabled={isLoading || socialLoading !== null}
            >
                {isLoading ? "Signing In..." : "Sign In"}
            </Button>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t mt-6">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or Continue with
                </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
                <Button 
                    variant="outline" 
                    type="button" 
                    className="w-full" 
                    disabled={isLoading || socialLoading !== null}
                    onClick={() => handleSocialSignIn('google')}
                >
                    {socialLoading === 'google' ? (
                        <span>Loading...</span>
                    ) : (
                        <>
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Google
                        </>
                    )}
                </Button>
                <Button 
                    variant="outline" 
                    type="button" 
                    className="w-full" 
                    disabled={isLoading || socialLoading !== null}
                    onClick={() => handleSocialSignIn('github')}
                >
                    {socialLoading === 'github' ? (
                        <span>Loading...</span>
                    ) : (
                        <>
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            GitHub
                        </>
                    )}
                </Button>
            </div>
            <div className="text-center text-sm mt-4">
                Don't have an account? {" "} 
                <Link href="/sign-up" className="underline underline-offset-4">Sign Up</Link>
            </div>
        </form>
        </Form>
        <div className="bg-gradient-to-br from-blue-600 to-purple-800 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <Image src="/logo.svg" alt="SuperMeet Logo" height={92} width={92} className="bg-transparent" />
            <p className="text-3xl font-semibold text-white">
                SuperMeet
            </p>
            <p className="text-blue-100 text-center max-w-xs">
                Welcome back! Continue your collaboration journey with our AI-powered meeting platform.
            </p>
        </div>
        </CardContent>
        </Card>
        <div className="text-muted-foreground text-center text-xs text-balance">
            By signing in you agree to our{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">Privacy Policy</a>
        </div>
    </div>
  );
};