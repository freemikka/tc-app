// components/change-password-dialog.jsx

import { useState } from "react";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ChangePasswordDialog({ trigger, onPasswordChange }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = "Current password is required";
        }

        if (!formData.newPassword) {
            newErrors.newPassword = "New password is required";
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters";
        } else if (
            !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)
        ) {
            newErrors.newPassword =
                "Password must contain uppercase, lowercase, and a number";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your new password";
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (formData.currentPassword === formData.newPassword) {
            newErrors.newPassword =
                "New password must be different from current";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({});

        // Run validation
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            if (onPasswordChange) {
                await onPasswordChange({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                });
            }

            // Success: reset form and close dialog
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setOpen(false);

            // Clear errors just in case
            setErrors({});
        } catch (error) {
            console.error("Password change failed:", error);

            // API error separate from validation
            setErrors({
                ...errors,
                apiError: "Failed to change password. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenChange = (isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            // Reset form when dialog closes
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setErrors({});
            setShowPasswords({ current: false, new: false, confirm: false });
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline">
                        <Lock className="mr-2 h-4 w-4" />
                        Change Password
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                        Enter your current password and choose a new secure
                        password.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {/* Current Password */}
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                            Current Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="currentPassword"
                                type={
                                    showPasswords.current ? "text" : "password"
                                }
                                value={formData.currentPassword}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        currentPassword: e.target.value,
                                    })
                                }
                                placeholder="Enter current password"
                                className={
                                    errors.currentPassword
                                        ? "border-red-500"
                                        : ""
                                }
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() =>
                                    togglePasswordVisibility("current")
                                }
                            >
                                {showPasswords.current ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                        {errors.currentPassword && (
                            <p className="text-sm text-red-500">
                                {errors.currentPassword}
                            </p>
                        )}
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={showPasswords.new ? "text" : "password"}
                                value={formData.newPassword}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        newPassword: e.target.value,
                                    })
                                }
                                placeholder="Enter new password"
                                className={
                                    errors.newPassword ? "border-red-500" : ""
                                }
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => togglePasswordVisibility("new")}
                            >
                                {showPasswords.new ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-sm text-red-500">
                                {errors.newPassword}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                            Confirm New Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={
                                    showPasswords.confirm ? "text" : "password"
                                }
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        confirmPassword: e.target.value,
                                    })
                                }
                                placeholder="Confirm new password"
                                className={
                                    errors.confirmPassword
                                        ? "border-red-500"
                                        : ""
                                }
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() =>
                                    togglePasswordVisibility("confirm")
                                }
                            >
                                {showPasswords.confirm ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* Password Requirements */}
                    <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                        <p className="font-medium mb-1">
                            Password requirements:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>At least 8 characters long</li>
                            <li>Contains uppercase and lowercase letters</li>
                            <li>Contains at least one number</li>
                        </ul>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Password"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
