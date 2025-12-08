import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

export interface InviteMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
}

export const InviteMemberDialog: React.FC<InviteMemberDialogProps> = ({ onSave, onClose, open }) => {
  const [memberId, setMemberId] = useState('');

  const handleClose = () => {
    onClose();
  };
  
  const handleSave = () => {
    onSave(memberId);
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Invite member</DialogTitle>
      <DialogContent>
        <TextField id="name" label="Member Id" variant="outlined" value={memberId} onChange={(e) => setMemberId(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}