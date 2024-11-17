import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";

const propertySchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  rent: z.number().positive({ message: "Rent must be a positive number" }),
  imageUrl: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal("")),
  street: z.string().min(3, { message: "Street must be at least 3 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  province: z.string().min(2, { message: "Province must be at least 2 characters" }),
  postalCode: z.string().min(5, { message: "Postal code must be valid" }),
});

export const CreateProperty = () => {
  const navigate = useNavigate();

  const { user } = useAppContext();

  useEffect(() => {
    if (user?.accountType !== 'owner') {
      // Redirect unauthorized users
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const form = useForm<z.infer<typeof propertySchema>>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      rent: 0,
      imageUrl: "",
      street: "",
      city: "",
      province: "",
      postalCode: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof propertySchema>) => {
    try {
      const res = await fetch("http://localhost:3500/api/properties/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success) {
        navigate("/dashboard");
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Failed to create property:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-lg mx-auto p-4 border rounded-lg shadow-sm"
      >
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description"
                  className="h-48"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Rent Field */}
        <FormField
          control={form.control}
          name="rent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rent</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter Rent Amount"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image URL Field */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Image URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Street Field */}
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street</FormLabel>
              <FormControl>
                <Input placeholder="Street" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City Field */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="City" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Province Field */}
        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Province</FormLabel>
              <FormControl>
                <Input placeholder="Province" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Postal Code Field */}
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input placeholder="Postal Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Create Property
        </Button>
      </form>
    </Form>
  );
};
