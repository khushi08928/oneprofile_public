import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "@/lib/axios";
import { Pencil, Save, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ProfileData {
    username: string;
    displayName: string;
    bio: string;
    profilePicture?: string;
}

export function ProfileInfo() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState<ProfileData | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get("/api/profile/me/profile", {
                withCredentials: true,
            });

            if (response.status === 200 && response.data) {
                const profileData = response.data.profile;
                setProfile(profileData);
                setEditedProfile(profileData);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editedProfile) return;

        setSaving(true);
        try {
            await axios.post("/api/profile/complete-onboarding", editedProfile, {
                withCredentials: true,
            });

            setProfile(editedProfile);
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
    };

    const getInitials = (name: string): string => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground">Loading profile...</p>
                </CardContent>
            </Card>
        );
    }

    if (!profile) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground">No profile found</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Profile Information</span>
                    {!isEditing ? (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsEditing(true)}
                            className="gap-1"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancel}
                                className="gap-1"
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSave}
                                disabled={saving}
                                className="gap-1"
                            >
                                <Save className="h-4 w-4" />
                                {saving ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                            {getInitials(profile.displayName || profile.username || "U")}
                        </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                        <Button variant="outline" size="sm">
                            Change Avatar
                        </Button>
                    )}
                </div>

                {/* Display Name */}
                <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    {isEditing ? (
                        <Input
                            id="displayName"
                            value={editedProfile?.displayName || ""}
                            onChange={(e) =>
                                setEditedProfile({
                                    ...editedProfile!,
                                    displayName: e.target.value,
                                })
                            }
                            placeholder="Your display name"
                        />
                    ) : (
                        <p className="text-sm">{profile.displayName || "Not set"}</p>
                    )}
                </div>

                {/* Username */}
                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    {isEditing ? (
                        <Input
                            id="username"
                            value={editedProfile?.username || ""}
                            onChange={(e) =>
                                setEditedProfile({
                                    ...editedProfile!,
                                    username: e.target.value,
                                })
                            }
                            placeholder="your-username"
                        />
                    ) : (
                        <p className="text-sm font-mono">@{profile.username || "Not set"}</p>
                    )}
                </div>

                {/* Bio */}
                <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                        <Textarea
                            id="bio"
                            value={editedProfile?.bio || ""}
                            onChange={(e) =>
                                setEditedProfile({
                                    ...editedProfile!,
                                    bio: e.target.value,
                                })
                            }
                            placeholder="Tell us about yourself..."
                            rows={4}
                        />
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            {profile.bio || "No bio yet"}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
