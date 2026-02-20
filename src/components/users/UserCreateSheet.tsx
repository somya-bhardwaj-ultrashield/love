import { useState, useEffect, useCallback } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Interest, Occupation } from "@/api";
import type { CreateUserPayload } from "@/api";
import { interestsApi, occupationsApi, usersApi } from "@/api";
import { countryCodeOptions } from "@/lib/countryCodes";

const HEIGHT_CM_OPTIONS = Array.from({ length: 17 }, (_, i) => 140 + i * 5); // 140 to 220
const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer not to say", label: "Prefer not to say" },
];
const SEXUAL_ORIENTATION_OPTIONS = [
  { value: "straight", label: "Straight" },
  { value: "gay", label: "Gay" },
  { value: "lesbian", label: "Lesbian" },
  { value: "bisexual", label: "Bisexual" },
  { value: "pansexual", label: "Pansexual" },
  { value: "other", label: "Other" },
  { value: "prefer not to say", label: "Prefer not to say" },
];

interface UserCreateSheetProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (user?: import("@/api/users").AdminUser) => void;
}

export function UserCreateSheet({ open, onClose, onSuccess }: UserCreateSheetProps) {
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [countryCodeOpen, setCountryCodeOpen] = useState(false);
  const [countryCodeSearch, setCountryCodeSearch] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<string>("");
  const [sexualOrientation, setSexualOrientation] = useState<string>("");
  const [height, setHeight] = useState<number | "">("");
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "accepted" | "rejected">("pending");
  const [isBlocked, setIsBlocked] = useState(false);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [relationshipGoal, setRelationshipGoal] = useState("");
  const [smokingHabit, setSmokingHabit] = useState("");
  const [drinkingHabit, setDrinkingHabit] = useState("");
  const [exerciseHabit, setExerciseHabit] = useState("");
  const [education, setEducation] = useState("");

  const [interests, setInterests] = useState<Interest[]>([]);
  const [interestsOpen, setInterestsOpen] = useState(false);
  const [interestsSearch, setInterestsSearch] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);

  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [occupationOpen, setOccupationOpen] = useState(false);
  const [occupationSearch, setOccupationSearch] = useState("");
  const [selectedOccupation, setSelectedOccupation] = useState<Occupation | null>(null);

  const fetchInterests = useCallback(async () => {
    try {
      const res = await interestsApi.list({ limit: 100 });
      setInterests(res.data ?? []);
    } catch {
      setInterests([]);
    }
  }, []);

  const fetchOccupations = useCallback(async () => {
    try {
      const res = await occupationsApi.list({ limit: 100 });
      setOccupations(res.data ?? []);
    } catch {
      setOccupations([]);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchInterests();
      fetchOccupations();
    }
  }, [open, fetchInterests, fetchOccupations]);

  useEffect(() => {
    if (!open) {
      setPhoneNumber("");
      setCountryCode("+91");
      setFirstName("");
      setLastName("");
      setGender("");
      setSexualOrientation("");
      setHeight("");
      setVerificationStatus("pending");
      setIsBlocked(false);
      setBio("");
      setLocation("");
      setDateOfBirth("");
      setRelationshipGoal("");
      setSmokingHabit("");
      setDrinkingHabit("");
      setExerciseHabit("");
      setEducation("");
      setSelectedInterests([]);
      setSelectedOccupation(null);
      setCountryCodeSearch("");
      setErrors({});
    }
  }, [open]);

  const filteredInterests = interests.filter((i) =>
    i.title.toLowerCase().includes(interestsSearch.toLowerCase())
  );
  const filteredOccupations = occupations.filter((o) =>
    o.title.toLowerCase().includes(occupationSearch.toLowerCase())
  );

  const filteredCountryCodes = countryCodeOptions.filter(
    (c) =>
      c.name.toLowerCase().includes(countryCodeSearch.toLowerCase()) ||
      c.dialCode.includes(countryCodeSearch)
  );
  const selectedCountryOption = countryCodeOptions.find((c) => c.dialCode === countryCode);

  const toggleInterest = (interest: Interest) => {
    setSelectedInterests((prev) =>
      prev.some((x) => x._id === interest._id)
        ? prev.filter((x) => x._id !== interest._id)
        : [...prev, interest]
    );
  };

  const removeInterest = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedInterests((prev) => prev.filter((x) => x._id !== id));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const digits = (phoneNumber || "").replace(/\D/g, "");
    if (digits.length < 10) e.phoneNumber = "Enter a valid phone number (at least 10 digits)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: CreateUserPayload = {
        phoneNumber: countryCode + (phoneNumber || "").replace(/\D/g, ""),
        countryCode,
        firstName: firstName.trim() || null,
        lastName: lastName.trim() || null,
        gender: gender || null,
        sexualOrientation: sexualOrientation || null,
        height: height === "" ? null : Number(height),
        verificationStatus,
        isBlocked,
        bio: bio.trim() || null,
        location: location.trim() || null,
        dateOfBirth: dateOfBirth || null,
        relationshipGoal: relationshipGoal.trim() || null,
        smokingHabit: smokingHabit.trim() || null,
        drinkingHabit: drinkingHabit.trim() || null,
        exerciseHabit: exerciseHabit.trim() || null,
        education: education.trim() || null,
        interests: selectedInterests.map((i) => i._id),
        occupation: selectedOccupation?._id ?? null,
      };
      const res = await usersApi.create(payload);
      const user = (res as { user?: import("@/api/users").AdminUser }).user;
      onSuccess(user);
      onClose();
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Failed to create user" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create User</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Country code</Label>
              <Popover open={countryCodeOpen} onOpenChange={setCountryCodeOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    {selectedCountryOption
                      ? `${selectedCountryOption.dialCode} ${selectedCountryOption.name}`
                      : "Select country..."}
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search country or code..."
                      value={countryCodeSearch}
                      onValueChange={setCountryCodeSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {filteredCountryCodes.map((c) => (
                          <CommandItem
                            key={c.code}
                            onSelect={() => {
                              setCountryCode(c.dialCode);
                              setCountryCodeOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                countryCode === c.dialCode ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {c.dialCode} {c.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone number *</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="9876543210"
                required
              />
              {errors.phoneNumber && (
                <p className="text-sm text-destructive">{errors.phoneNumber}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Interests</Label>
            <Popover open={interestsOpen} onOpenChange={setInterestsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between min-h-10 h-auto py-2"
                >
                  <span className="flex flex-wrap gap-1">
                    {selectedInterests.length === 0
                      ? "Search interests..."
                      : selectedInterests.map((i) => (
                          <Badge
                            key={i._id}
                            variant="secondary"
                            className="mr-1 gap-0.5"
                          >
                            {i.title}
                            <button
                              type="button"
                              onClick={(ev) => removeInterest(ev, i._id)}
                              className="ml-0.5 rounded-full outline-none hover:bg-muted"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                  </span>
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search interests..."
                    value={interestsSearch}
                    onValueChange={setInterestsSearch}
                  />
                  <CommandList>
                    <CommandEmpty>No interest found.</CommandEmpty>
                    <CommandGroup>
                      {filteredInterests.map((interest) => {
                        const isSelected = selectedInterests.some((x) => x._id === interest._id);
                        return (
                          <CommandItem
                            key={interest._id}
                            onSelect={() => toggleInterest(interest)}
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}
                            />
                            {interest.title}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Occupation</Label>
            <Popover open={occupationOpen} onOpenChange={setOccupationOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  {selectedOccupation ? selectedOccupation.title : "Search occupation..."}
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search occupation..."
                    value={occupationSearch}
                    onValueChange={setOccupationSearch}
                  />
                  <CommandList>
                    <CommandEmpty>No occupation found.</CommandEmpty>
                    <CommandGroup>
                      {filteredOccupations.map((occ) => (
                        <CommandItem
                          key={occ._id}
                          onSelect={() => {
                            setSelectedOccupation(occ);
                            setOccupationOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedOccupation?._id === occ._id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {occ.title}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Select
              value={height === "" ? "none" : String(height)}
              onValueChange={(v) => setHeight(v === "none" ? "" : Number(v))}
            >
              <SelectTrigger id="height">
                <SelectValue placeholder="Select height" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                {HEIGHT_CM_OPTIONS.map((h) => (
                  <SelectItem key={h} value={String(h)}>
                    {h} cm
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={gender || "none"} onValueChange={(v) => setGender(v === "none" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">—</SelectItem>
                  {GENDER_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sexual orientation</Label>
              <Select value={sexualOrientation || "none"} onValueChange={(v) => setSexualOrientation(v === "none" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">—</SelectItem>
                  {SEXUAL_ORIENTATION_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Profile status</Label>
              <Select
                value={verificationStatus}
                onValueChange={(v) => setVerificationStatus(v as "pending" | "accepted" | "rejected")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Account status</Label>
              <Select
                value={isBlocked ? "inactive" : "active"}
                onValueChange={(v) => setIsBlocked(v === "inactive")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Short bio"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or area"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="relationshipGoal">Relationship goal</Label>
              <Input
                id="relationshipGoal"
                value={relationshipGoal}
                onChange={(e) => setRelationshipGoal(e.target.value)}
                placeholder="e.g. Long-term"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Input
                id="education"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. Graduate"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-2">
              <Label htmlFor="smokingHabit">Smoking</Label>
              <Input
                id="smokingHabit"
                value={smokingHabit}
                onChange={(e) => setSmokingHabit(e.target.value)}
                placeholder="—"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="drinkingHabit">Drinking</Label>
              <Input
                id="drinkingHabit"
                value={drinkingHabit}
                onChange={(e) => setDrinkingHabit(e.target.value)}
                placeholder="—"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exerciseHabit">Exercise</Label>
              <Input
                id="exerciseHabit"
                value={exerciseHabit}
                onChange={(e) => setExerciseHabit(e.target.value)}
                placeholder="—"
              />
            </div>
          </div>

          {errors.submit && (
            <p className="text-sm text-destructive">{errors.submit}</p>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? "Creating..." : "Create user"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
