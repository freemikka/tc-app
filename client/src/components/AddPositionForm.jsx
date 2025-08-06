import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCreateTeam } from "../mutations/createTeam";
import { useTeams } from "../hooks/useTeams";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useCreatePosition } from "../mutations/CreatePosition";

const hexColorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

const formSchema = z.object({
    positionName: z.string().min(2, {
        message: "Position name must be at least 2 characters.",
    }),
    positionColor: z
        .string()
        .min(5, {
            message: "Color name must be at least 6 characters.",
        })
        .regex(hexColorRegex, { message: "Must be a hex string" }),
});

const AddPositionForm = () => {
    const { mutate: createPosition } = useCreatePosition();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            positionName: "",
            positionColor: "#ffffff",
        },
    });

    function onSubmit(values) {
        createPosition(values);
        form.reset();
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <NavigationMenuLink className="cursor-pointer">
                    Add Position
                </NavigationMenuLink>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new position</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="positionName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="positionColor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color (click me)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="color"
                                            placeholder="Color"
                                            value={field.value}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddPositionForm;
