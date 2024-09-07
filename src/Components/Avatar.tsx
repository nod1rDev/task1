import * as React from "react";

import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import Tooltip from "@mui/material/Tooltip";

import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { auth, database } from "../firebase";
import { signOut } from "firebase/auth";
import { ref, update } from "firebase/database";

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [userData, setUserData] = React.useState<any>();
  const open = Boolean(anchorEl);
  const updateData = (path: string, newData: object) => {
    const dbRef = ref(database, path); // Yangilash kerak bo'lgan yo'l
    update(dbRef, newData)
      .then(() => {
        console.log("Data updated successfully");
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (pathh?: any) => {
    const res = auth;
    const newData = {
      username: `@${res.currentUser?.email?.slice(
        0,
        res.currentUser.email.length - 10
      )}`,
      email: res.currentUser?.email,
      logo: res.currentUser?.email?.slice(0, 1).toUpperCase(),
      id: res.currentUser?.uid,
      active: false,
    };
    const path = "users/" + res.currentUser?.uid;
    pathh == "out" && updateData(path, newData);
    pathh == "out" ? signOut(auth) : "";
    pathh == "out" && location.reload();
    setAnchorEl(null);
  };
  React.useEffect(() => {
    const user = auth.currentUser;
    setUserData(user);
  }, []);
  return (
    <React.Fragment>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2, mt: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar sx={{ width: 44, height: 44 }}>
            {userData && userData.email.slice(0, 1).toUpperCase()}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                left: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose("out");
          }}
        >
          <ListItemIcon>
            <Logout color="error" fontSize="small" />
          </ListItemIcon>
          <div className="text-red-600">Logout</div>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
