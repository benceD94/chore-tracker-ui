import React, { useState } from "react";
import { useAuth } from "../../authentication/AuthContext";
import { Avatar, Box, Button, Card, CardContent, Chip, IconButton, Skeleton, Typography } from "@mui/material";
import { HouseholdDialog } from "./components/HouseholdDialog";
import { addHouseholdMember, createHousehold } from "../../infra/households";
import { Edit, Home } from "@mui/icons-material";
import { Members } from "./components/Members";
import { useSettingsProvider } from "../../authentication/SettingsProvider";

export const HouseholdPage: React.FC = () => {
  const { user } = useAuth();
  const { household, isLoaded } = useSettingsProvider();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  async function handleCreateHousehold(householdName: string) {
    if (!user) return;

    try {
      await createHousehold(user?.uid, householdName.trim());
    } catch (err: any) {
      console.error("Failed to create household", err);
    }
  }

  async function handleAddMember(memberId: string) {
    if (!household) return;

    try {
      await addHouseholdMember(household.id, memberId);
    } catch (err: any) {
      console.error("Filed to add user", err);
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

  return !isLoaded ? <Skeleton variant="rounded" width={210} height={60} /> : 
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

            <Members household={household} onAddMember={handleAddMember} />
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
