"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Course } from "@prisma/client";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import RichEditor from "@/components/custom/RichEditor";
import { ComboBox } from "@/components/custom/ComboBox";
import FileUpload from "@/components/custom/FileUpload";
import Link from "next/link";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { DatePicker } from "../ui/date-picker";
import { Trash } from "lucide-react";
import Delete from "../custom/Delete";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters long",
  }),
  description: z.string().optional(),
  categoryId: z.string().min(1, {
    message: "Category is required",
  }),
  levelId: z.string().min(1, {
    message: "Leevel is required",
  }),
  imageUrl: z.string().optional(),
  price: z.coerce.number().optional(),
  startAge: z.coerce.number().optional(),
  endAge: z.coerce.number().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  cityId: z.string().min(1, {
    message: "City is required",
  }),
})

interface EditCourseFormProps {
  course: Course;
  categories: {
    label: string;
    value: string;
  }[];
  levels: {
    label: string;
    value: string
  }[];
  cities: {
    label: string;
    value: string
  }[];
}

const EditCourseForm = ({ course, categories, levels, cities }: EditCourseFormProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course.title,
      description: course.description || "",
      categoryId: course.categoryId,
      levelId: course.levelId || "",
      imageUrl: course.imageUrl || "",
      price: course.price || undefined,
      startAge: course.startAge || undefined,
      endAge: course.endAge || undefined,
      startDate: course.startDate ? new Date(course.startDate) : undefined,
      endDate: course.endDate ? new Date(course.endDate) : undefined,
      cityId: course.cityId || ""
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${course.id}`, values);
      toast.success("Course Updated");
      router.refresh();
    } catch (err: any) {
      // Перевірка на помилку Axios
      if (err.response) {
        console.error("Response error:", {
          status: err.response.status,
          data: err.response.data,
        });
        toast.error(`Error ${err.response.status}: ${err.response.data}`);
      } else if (err.request) {
        console.error("Request error:", err.request);
        toast.error("No response received from server.");
      } else {
        console.error("Unexpected error:", err.message);
        toast.error("An unexpected error occurred.");
      }
    }
  };


  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between mb-7">
        <div className="flex gap-5 items-start mt-[5vh] ml-[120vh]">
          <Button variant="outline">Publish</Button>
          <Delete item="course" courseId={course.id} />
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Назва<span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Опис <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RichEditor
                    placeholder="Про що цей курс?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap gap-10">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Категорія <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <ComboBox options={categories} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="levelId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Для кого розрахований курс <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <ComboBox options={levels} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
          <div className="flex flex-wrap gap-10">
            <FormField
              control={form.control}
              name="startAge"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Мінімальний вік <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endAge"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Максимальний вік <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
          <div className="flex flex-wrap gap-10">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Початок курсу <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Кінець курсу <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="cityId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Місто <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <ComboBox options={cities} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Заставка
                </FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value || ""}
                    onChange={(url) => field.onChange(url)}
                    endpoint="courseBanner"
                    page="Edit Course"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Ціна
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-5">
            <Link href="/instructor/courses">
              <Button variant="outline" type="button">
                Скасувати
              </Button>
            </Link>
            <Button type="submit">Зберегти</Button>
          </div>
        </form>
      </Form>
    </>
  )
}

export default EditCourseForm