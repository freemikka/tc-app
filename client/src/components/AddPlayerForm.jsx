import React, { useState, useEffect, useMemo } from "react";
import { useTeams } from "../hooks/useTeams";
import { useTrainingGroups } from "../hooks/useTrainingGroups";
import { usePositions } from "../hooks/usePositions";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

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
import { useCreatePlayer } from "../mutations/createPlayer";

import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AddPlayerForm = () => {
    const {
        data: teams,
        isLoading: isTrainingGroupsLoading,
        isError: isTrainingGroupsError,
    } = useTeams();

    const {
        data: trainingGroups,
        isLoading: isTeamsLoading,
        isError: isTeamsError,
    } = useTrainingGroups();

    const {
        data: positions,
        isLoading: isPositionsLoading,
        isError: isPositionsError,
    } = usePositions();

    const { mutate: createPlayer } = useCreatePlayer();

    const isLoading =
        isPositionsLoading || isTeamsLoading || isTrainingGroupsLoading;
    // Base schema that's always available
    const baseSchema = z.object({
        firstName: z
            .string()
            .min(2, "First name must be at least 2 characters."),
        lastName: z.string().min(2, "Last name must be at least 2 characters."),
        // email: z.string().email("Invalid email."),
    });

    const formSchema = useMemo(() => {
        if (isLoading || !positions || !teams || !trainingGroups) {
            return baseSchema;
        }

        return baseSchema.extend({
            positionId:
                positions && positions.length > 0
                    ? z.enum(positions.map((p) => String(p.id)))
                    : z.string().optional(),
            teamId:
                teams && teams.length > 0
                    ? z.enum(teams.map((t) => String(t.id)))
                    : z.string().optional(),
            trainingGroupId:
                trainingGroups && trainingGroups.length > 0
                    ? z.enum(trainingGroups.map((g) => String(g.id)))
                    : z.string().optional(),
        });
    }, [isLoading, positions, teams, trainingGroups]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: "onTouched",
        reValidateMode: "onTouched",
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            // Add defaults for dynamic fields
            ...(positions && { positionId: "" }),
            ...(teams && { teamId: "" }),
            ...(trainingGroups && { trainingGroupId: "" }),
        },
    });

    const onSubmit = (values) => {
        createPlayer({ ...values });
        form.reset({ positionId: "", teamId: "", trainingGroupId: "" });
    };

    if (!formSchema) {
        return <div>Loading...</div>;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <NavigationMenuLink className="cursor-pointer">
                    Add Player
                </NavigationMenuLink>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new player</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First name</FormLabel>
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
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last name</FormLabel>
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
                        {/* <FormField
                            control={form.control}
                            name="emal"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Dames 1"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

                        <FormField
                            control={form.control}
                            name="teamId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Team</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a team" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {teams?.map((team) => {
                                                    return (
                                                        <SelectItem
                                                            key={team.id}
                                                            value={String(
                                                                team.id
                                                            )}
                                                        >
                                                            {team.name}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="positionId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Position</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a position" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {positions?.map((position) => {
                                                    return (
                                                        <SelectItem
                                                            key={position.id}
                                                            value={String(
                                                                position.id
                                                            )}
                                                        >
                                                            {
                                                                position.position_name
                                                            }
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="trainingGroupId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Training Group</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a training group" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {trainingGroups?.map(
                                                    (trainingGroup) => {
                                                        return (
                                                            <SelectItem
                                                                key={
                                                                    trainingGroup.id
                                                                }
                                                                value={String(
                                                                    trainingGroup.id
                                                                )}
                                                            >
                                                                {
                                                                    trainingGroup.name
                                                                }
                                                            </SelectItem>
                                                        );
                                                    }
                                                )}
                                            </SelectContent>
                                        </Select>
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

export default AddPlayerForm;
