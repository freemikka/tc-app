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
import { useCreateTrainingGroup } from "../mutations/createTrainingGroup";

const formSchema = z.object({
    teamName: z.string().min(2, {
        message: "Team name must be at least 2 characters.",
    }),
    gender: z.enum(["Male", "Female"]),
    type: z.boolean(false),
});

const AddTeamForm = () => {
    const { mutate: createTeam } = useCreateTeam();
    const { mutate: createTrainingGroup } = useCreateTrainingGroup();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            teamName: "",
            gender: "",
            type: false,
        },
    });

    function onSubmit(values) {
        console.log(values);
        if (values.type) {
            createTrainingGroup({
                name: values.teamName,
                gender: values.gender,
            });
        } else {
            createTeam({ name: values.teamName, gender: values.gender });
        }
        form.reset();
        form.setValue("gender", values.gender);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <NavigationMenuLink className="cursor-pointer">
                    Add Team/Training group
                </NavigationMenuLink>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new team or training group</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="teamName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Dames 1"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-row items-start ">
                            <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gender</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a gender" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Male">
                                                            Male
                                                        </SelectItem>
                                                        <SelectItem value="Female">
                                                            Female
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex-1 flex items-center mt-2">
                                {" "}
                                {/* pt-7 aligns with the select input */}
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <div className="mt-2">
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </div>
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Training group
                                                </FormLabel>
                                                <FormDescription>
                                                    Check this box if this is a
                                                    traininggroup
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>{" "}
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddTeamForm;
