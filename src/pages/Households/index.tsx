import React, { useEffect, useState } from "react";
import { useAuth } from "../../authentication/AuthContext";
import type { HouseholdDoc } from "../../types/firestore";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { Avatar, Box, Button, Card, CardContent, Chip, Divider, IconButton, Skeleton, Typography } from "@mui/material";
import { HouseholdDialog } from "./components/HouseholdDialog";
import { createHousehold } from "../../infra/households";
import { Edit, Home } from "@mui/icons-material";
import { Collection } from "../../enums/firebase";

export const HouseholdPage: React.FC = () => {
  const { user } = useAuth();

  const [household, setHousehold] = useState<HouseholdDoc | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const householdsRef = collection(db, Collection.Households);
    const q = query(
      householdsRef,
      where("memberIds", "array-contains", user?.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs: HouseholdDoc[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Omit<HouseholdDoc, "id">;
          return {
            id: docSnap.id,
            ...data,
          };
        });
        setHousehold(docs[0]);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching households:", err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user])

  async function handleCreateHousehold(householdName: string) {
    if (!user) return;

    try {
      await createHousehold(user?.uid, householdName.trim());
    } catch (err: any) {
      console.error("Failed to create household", err);
    }
  }

  const handleAddHouseHoldClick = () => {
    setIsDialogOpen(true);
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  }

  const handleDialogSave = (name: string) => {
    setIsDialogOpen(false);
    handleCreateHousehold(name);
  }

  return isLoading ? <Skeleton variant="rounded" width={210} height={60} /> : 
    (
      <Box sx={{ maxWidth: 960, margin: '0 auto' }}>
        {
          household ? <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Household
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your household details and members.
              </Typography>
            </Box>

            <Card sx={{ mb: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                      <Home />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Household name
                      </Typography>
                      <Typography variant="h6">{household?.name}</Typography>
                    </Box>
                  </Box>

                  {/* Right Side */}
                  <IconButton size="small" aria-label="edit household">
                    <Edit />
                  </IconButton>
                </Box>

                {/* Body */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Shared household for chore tracking.
                  </Typography>
                </Box>

                {/* Footer Row */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Chip label={`Household ID: ${household.id}`} size="small" variant="outlined" />
                </Box>
              </CardContent>
            </Card>

            {/* Members Section */}
            <Card sx={{ mb: 4 }}>
              <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Members</Typography>
                  <Chip label={`${household?.memberIds.length} members`} size="small" />
                </Box>

                <Divider sx={{ mb: 2 }} />
              </CardContent>
            </Card>
          </> : <>
            <Button variant="contained" size="small" onClick={handleAddHouseHoldClick}>Add Household</Button>
            <HouseholdDialog
              open={isDialogOpen}
              onClose={handleDialogClose}
              onSave={handleDialogSave}
            />
          </>
        }
      </Box>
    )
};
