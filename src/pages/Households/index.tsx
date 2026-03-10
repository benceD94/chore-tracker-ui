import React, { useState } from "react";
import { useAuth } from "../../authentication/AuthContext/hooks";
import { Avatar, Box, Button, Card, CardContent, Chip, IconButton, Skeleton, Typography } from "@mui/material";
import { HouseholdDialog } from "./components/HouseholdDialog";
import { JoinHouseholdDialog } from "./components/JoinHouseholdDialog";
import {
  useCreateHouseholdMutation,
  useUpdateHouseholdMutation,
  useAddHouseholdMemberMutation
} from "../../hooks/mutations";
import { Edit, Home, Add, GroupAdd, ContentCopy } from "@mui/icons-material";
import { Members } from "./components/Members";
import { useSettingsProvider } from "../../authentication/SettingsProvider/hooks";
import { useToast } from "../../components/ToastProvider/hooks";

export const HouseholdPage: React.FC = () => {
  const { user } = useAuth();
  const { notify } = useToast();
  const { household, isLoaded } = useSettingsProvider();

  const createHouseholdMutation = useCreateHouseholdMutation();
  const updateHouseholdMutation = useUpdateHouseholdMutation();
  const addHouseholdMemberMutation = useAddHouseholdMemberMutation();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditDialog, setIsEditDialog] = useState<boolean>(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState<boolean>(false);

  const isCreating = createHouseholdMutation.isPending;

  function handleCreateHousehold(householdName: string) {
    if (!user) return;

    createHouseholdMutation.mutate(
      { name: householdName.trim() },
      {
        onSuccess: () => {
          notify.success('Household created with default categories and chores');
        },
        onError: (err) => {
          notify.error('Failed to create household');
          console.error("Failed to create household", err);
        },
      }
    );
  }

  function handleAddMember(memberId: string) {
    if (!household) return;

    addHouseholdMemberMutation.mutate(
      { householdId: household.id, userId: memberId },
      {
        onSuccess: () => {
          notify.success('Member added');
        },
        onError: (err) => {
          notify.error('Failed to add user');
          console.error("Failed to add user", err);
        },
      }
    );
  }

  function handleJoinHousehold(householdId: string) {
    if (!user) return;

    addHouseholdMemberMutation.mutate(
      { householdId, userId: user.uid },
      {
        onSuccess: () => {
          setIsJoinDialogOpen(false);
          notify.success('Joined household');
        },
        onError: (err) => {
          notify.error('Failed to join household. Please check the household ID.');
          console.error("Failed to join household", err);
        },
      }
    );
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
    if (isEditDialog && household) {
      updateHouseholdMutation.mutate(
        { id: household.id, data: { name } },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setIsEditDialog(false);
            notify.success('Household updated');
          },
          onError: (err) => {
            notify.error('Failed to update household');
            console.error("Failed to update household", err);
          },
        }
      );
    } else {
      setIsDialogOpen(false);
      handleCreateHousehold(name);
    }
  }

  if (!isLoaded || isCreating) {
    return (
      <Box sx={{ maxWidth: 960, margin: '0 auto' }}>
        <Skeleton variant="rounded" width="100%" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" width="100%" height={200} />
      </Box>
    );
  }

  return (
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
                  <Chip
                    label={`Household ID: ${household.id}`}
                    size="small"
                    variant="outlined"
                    deleteIcon={<ContentCopy sx={{ fontSize: 14 }} />}
                    onDelete={() => {
                      navigator.clipboard.writeText(household.id);
                      notify.success('Household ID copied');
                    }}
                  />
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
