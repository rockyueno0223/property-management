import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
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
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { MapComponent } from "@/components/MapComponent";
import { ProvinceSelect } from "@/components/ProvinceSelect";

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

export const UpdateProperty = () => {
  const navigate = useNavigate();

  const { propertyId } = useParams<{ propertyId: string }>();
  const { user, properties } = useAppContext();

  const property = properties.find((prop) => prop.id === propertyId);

  const [formValues, setFormValues] = useState<z.infer<typeof propertySchema> | null>(null);

  useEffect(() => {
    if (!property || user?.id !== property.ownerId) {
      // Redirect unauthorized users
      navigate("/dashboard");
    }
  }, [property, user, navigate]);

  const form = useForm<z.infer<typeof propertySchema>>({
    resolver: zodResolver(propertySchema),
    defaultValues: formValues || {
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

  useEffect(() => {
    if (property) {
      setFormValues({
        title: property.title,
        description: property.description || "",
        rent: property.rent,
        imageUrl: property.imageUrl || "",
        street: property.street,
        city: property.city,
        province: property.province,
        postalCode: property.postalCode,
      });
      form.reset({
        title: property.title,
        description: property.description || "",
        rent: property.rent,
        imageUrl: property.imageUrl || "",
        street: property.street,
        city: property.city,
        province: property.province,
        postalCode: property.postalCode,
      });
    }
  }, [property, form]);

  const onSubmit = async (values: z.infer<typeof propertySchema>) => {
    try {
      const transformedValues = {
        ...values,
        description: values.description || null,
        imageUrl: values.imageUrl || null,
      };

      const res = await fetch(`http://localhost:3500/api/properties/${propertyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transformedValues),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        toast('Property has been updated');
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Failed to update property:", error);
    }
  };

  const onDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3500/api/properties/${propertyId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        toast('Property has been deleted');
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Failed to delete property:", error);
    }
  }

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
                <Input placeholder="Property Title" {...field} />
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
                <Textarea placeholder="Description" className="h-48" {...field} />
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
                <ProvinceSelect
                  value={field.value}
                  onChange={field.onChange}
                />
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

        <MapComponent address={`${property?.street}, ${property?.city}, ${property?.province}`} />

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <Button type="submit" className="w-full">
            Update Property
          </Button>
          <Button
            type="button"
            onClick={onDelete}
            variant="destructive"
            className="w-full"
          >
            Delete Property
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/dashboard')}
            className="w-full mt-4"
          >
            Back to Dashboard
          </Button>
        </div>
      </form>
      <Toaster />
    </Form>
  );
};
