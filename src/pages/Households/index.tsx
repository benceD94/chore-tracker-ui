import React, { useState } from "react";
import { useAuth } from "../../authentication/AuthContext";
import { Avatar, Box, Button, Card, CardContent, Chip, IconButton, Skeleton, Typography } from "@mui/material";
import { HouseholdDialog } from "./components/HouseholdDialog";
import { JoinHouseholdDialog } from "./components/JoinHouseholdDialog";
import { addHouseholdMember, createHousehold, updateHousehold } from "../../infra/households";
import { Edit, Home, Add, GroupAdd } from "@mui/icons-material";
import { Members } from "./components/Members";
import { useSettingsProvider } from "../../authentication/SettingsProvider";
import { useToast } from "../../components/ToastProvider";

export const HouseholdPage: React.FC = () => {
  const { user } = useAuth();
  const { notify } = useToast();
  const { household, isLoaded } = useSettingsProvider();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditDialog, setIsEditDialog] = useState<boolean>(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState<boolean>(false);

  async function handleCreateHousehold(householdName: string) {
    if (!user) return;

    try {
      await createHousehold(user?.uid, householdName.trim());
      notify.success('Household created');
    } catch (err: any) {
      notify.error('Failed to create household');
      console.error("Failed to create household", err);
    }
  }

  async function handleAddMember(memberId: string) {
    if (!household) return;

    try {
      await addHouseholdMember(household.id, memberId);
    } catch (err: any) {
      notify.error('Failed to add user');
      console.error("Filed to add user", err);
    }
  }

  async function handleJoinHousehold(householdId: string) {
    if (!user) return;

    try {
      await addHouseholdMember(householdId, user.uid);
      setIsJoinDialogOpen(false);
      notify.success('Joined household');
    } catch (err: any) {
      notify.error('Failed to join household. Please check the household ID.');
      console.error("Failed to join household", err);
    }
  }

  const handleAddHouseHoldClick = () => {
    setIsDialogOpen(true);
  }

  const handleEditHouseHoldClick = () => {
    setIsEditDialog(true);
    setIsDialogOpen(true);
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsEditDialog(false);
  }

  const handleDialogSave = (name: string) => {
    setIsDialogOpen(false);
    if (isEditDialog && household) {
      updateHousehold(household.id, name)
        .then(() => {
          setIsEditDialog(false);
          notify.success('Household updated');
        });
    } else {
      handleCreateHousehold(name);
    }
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

                  <IconButton size="small" aria-label="edit household" onClick={handleEditHouseHoldClick}>
                    <Edit />
                  </IconButton>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Shared household for chore tracking.
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Chip label={`Household ID: ${household.id}`} size="small" variant="outlined" />
                </Box>
              </CardContent>
            </Card>

            <Members household={household} onAddMember={handleAddMember} />
          </> : <>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              textAlign: 'center',
              px: 3
            }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 80,
                  height: 80,
                  mb: 3
                }}
              >
                <Home sx={{ fontSize: 40 }} />
              </Avatar>

              <Typography variant="h5" gutterBottom>
                Welcome to Chore Tracker
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
                Get started by creating a new household or join an existing one with a household ID from another member.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Add />}
                  onClick={handleAddHouseHoldClick}
                  sx={{ minWidth: 180 }}
                >
                  Create Household
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<GroupAdd />}
                  onClick={() => setIsJoinDialogOpen(true)}
                  sx={{ minWidth: 180 }}
                >
                  Join Household
                </Button>
              </Box>
            </Box>
          </>
        }
        <HouseholdDialog
          open={isDialogOpen}
          isEdit={isEditDialog}
          household={household}
          onClose={handleDialogClose}
          onSave={handleDialogSave}
        />
        <JoinHouseholdDialog
          open={isJoinDialogOpen}
          onClose={() => setIsJoinDialogOpen(false)}
          onJoin={handleJoinHousehold}
        />
      </Box>
    )
};
