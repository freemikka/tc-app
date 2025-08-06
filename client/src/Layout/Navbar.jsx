import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import AddTeamForm from "../components/AddTeamForm";
import AddPlayerForm from "../components/AddPlayerForm";
import AddPositionForm from "../components/AddPositionForm";
import { useNavigate, useLocation, replace } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import ExcelDownload from "../features/excelDownload"; // Uses some NodeJs library that isnt supported in the browser TODO
import ShowJoinRequests from "@/components/ShowJoinRequests";
import { signOutUser } from "../services/authService";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        data: profile,
        isLoading: isProfileLoading,
        isError: isProfileError,
    } = useProfile();

    const queryClient = useQueryClient();
    const handleSignOut = async () => {
        const error = await signOutUser();
        if (!error) {
            queryClient.removeQueries({ queryKey: ["authSession"] });
            navigate("/login", { replace: true });
        } else {
            console.error("Sign out failed:", error);
        }
    };

    const createExcelPrintout = () => {
        ExcelDownload();
    };

    const pathToOtherGroup = () => {
        const purePath = location.pathname.slice(1);
        if (purePath.startsWith("traininggroep-")) {
            return purePath.slice("traininggroep-".length);
        } else {
            return "traininggroep-" + purePath;
        }
    };

    return (
        <div className="w-full p-0 p-2">
            <NavigationMenu className="w-full max-w-none justify-start p-0 ">
                <NavigationMenuList className="flex w-full p-0">
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/">
                            Dashboard
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink href={pathToOtherGroup()}>
                            {pathToOtherGroup()}
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    {/* Modal-wrapped nav item */}
                    <NavigationMenuItem>
                        <AddTeamForm />
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <AddPlayerForm />
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <AddPositionForm />
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Button variant="ghost" onClick={createExcelPrintout}>
                            Excel printout
                        </Button>
                    </NavigationMenuItem>
                    {!isProfileLoading &&
                        !isProfileError &&
                        profile.association_id && <ShowJoinRequests />}
                    <div className="ml-auto flex items-center gap-2 mr-4">
                        <NavigationMenuItem>
                            <Button
                                variant="destructive"
                                onClick={handleSignOut}
                            >
                                Sign out
                            </Button>
                        </NavigationMenuItem>
                    </div>
                </NavigationMenuList>
            </NavigationMenu>
            <div className="mt-2">
                <Separator />
            </div>
        </div>
    );
};

export default Navbar;
