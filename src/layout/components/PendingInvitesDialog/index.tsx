import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { usePendingInvitesQuery } from '../../../hooks/queries';
import {
  useAcceptInviteMutation,
  useRejectInviteMutation,
} from '../../../hooks/mutations';
import { useToast } from '../../../components/ToastProvider/hooks';
import type { InviteResponseDto } from '../../../api/types';

export interface PendingInvitesDialogProps {
  open: boolean;
  onClose: () => void;
}

export const PendingInvitesDialog: React.FC<PendingInvitesDialogProps> = ({
  open,
  onClose,
}) => {
  const { notify } = useToast();
  const { data: invites, isLoading } = usePendingInvitesQuery();
  const acceptMutation = useAcceptInviteMutation();
  const rejectMutation = useRejectInviteMutation();

  const handleAccept = (invite: InviteResponseDto) => {
    acceptMutation.mutate(invite.id, {
      onSuccess: () => {
        notify.success(`Joined ${invite.householdName}`);
      },
      onError: (err) => {
        notify.error('Failed to accept invite');
        console.error('Failed to accept invite', err);
      },
    });
  };

  const handleReject = (invite: InviteResponseDto) => {
    rejectMutation.mutate(invite.id, {
      onSuccess: () => {
        notify.success('Invite declined');
      },
      onError: (err) => {
        notify.error('Failed to decline invite');
        console.error('Failed to decline invite', err);
      },
    });
  };

  const pendingInvites = invites ?? [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Pending Invites</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <CircularProgress sx={{ display: 'block', mx: 'auto', my: 3 }} />
        ) : pendingInvites.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 2 }}>
            No pending invites.
          </Typography>
        ) : (
          <List disablePadding>
            {pendingInvites.map((invite, index) => (
              <Box key={invite.id}>
                {index > 0 && <Divider />}
                <ListItem
                  sx={{ px: 0, py: 2 }}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleReject(invite)}
                        disabled={rejectMutation.isPending}
                      >
                        Decline
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleAccept(invite)}
                        disabled={acceptMutation.isPending}
                      >
                        Accept
                      </Button>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={invite.fromUser.photoURL} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={invite.householdName}
                    secondary={`Invited by ${invite.fromUser.displayName || 'Unknown'}`}
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};
