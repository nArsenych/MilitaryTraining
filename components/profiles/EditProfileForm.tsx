"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Course, Profile } from "@prisma/client";

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
import { DatePicker } from "@/components/ui/date-picker";
import { Trash } from "lucide-react";
import Delete from "@/components/custom/Delete";
import PublishButton from "@/components/custom/PublishButton";
import { Checkbox } from "@radix-ui/react-checkbox";

const formSchema = z.object({
    full_name: z.string().min(2, {
        message: "Name must be at least 2 characters long",
    }),
    description: z.string().optional(),
    phone_number: z.string().min(10, {}),
    isMilitary: z.boolean().optional(),
    age: z.coerce.number().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    telegram: z.string().optional(),
})

interface EditProfileFormProps {
    profile: Profile;
    isOrganization: boolean;
}

const EditProfileForm = ({ profile, isOrganization }: EditProfileFormProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            full_name: profile.full_name || "",
            description: profile.description || "",
            phone_number: profile.phone_number || "",
            isMilitary: profile.isMilitary || undefined,
            age: profile.age || undefined,
            instagram: profile.instagram || undefined,
            telegram: profile.telegram || undefined,
            facebook: profile.facebook || undefined
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/profiles/${profile.id}`, values);
            toast.success("Profile Updated");
            router.refresh();
        } catch (err: any) {
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
                <div className="flex gap-5">
                    <p>Заповніть інформацію про себе</p>
                </div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Ім'я<span className="text-red-500">*</span>
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
                                    Опис
                                </FormLabel>
                                <FormControl>
                                    <RichEditor
                                        placeholder="Розкажіть про себе"
                                        {...field}
                                        value={field.value || ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone_number"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    Номер телефону <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {!isOrganization && (
                        <FormField
                            control={form.control}
                            name="isMilitary"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>
                                        Для кого розрахований курс
                                    </FormLabel>
                                    <FormControl>
                                        <Checkbox />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    Ваш вік
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


                    <div className="flex flex-wrap gap-10">
                        <FormField
                            control={form.control}
                            name="instagram"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>
                                        Instagram
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
                            name="telegram"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>
                                        Telegram
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
                            name="facebook"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>
                                        Facebook
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                    </div>
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

export default EditProfileForm;