import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { useAppContext } from "@/context/AppContext"

const formSchema = z.object({
  username: z.string()
    .min(2, { message: "Username must be at least 2 characters" })
    .max(50, { message: "Username must be at most 50 characters" }),

  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(50, { message: "Password must be at most 50 characters" }),
});

export const Signin = () => {
  const navigate = useNavigate();
  const { setUser } = useAppContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch('http://localhost:3500/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        console.error(data.message);
        return;
      }
      if (res.ok) {
        setUser(data.user);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-3xl space-y-8">

          {/* Username field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>

          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to='/signup' className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </form>
      </Form>
    </div>
  )
}
