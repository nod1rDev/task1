import React, { useEffect, useState } from "react";
import AccountMenu from "./Avatar";
import InputBase from "@mui/material/InputBase";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { onValue, ref } from "firebase/database";
import { auth, database } from "../firebase";
import { useDispatch } from "react-redux";
import { changeId } from "./ChatwindowSlice";
import Badge from "@mui/material/Badge";
const Sidebar: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [value, setValue] = useState<any>([]);
  useEffect(() => {
    const starCountRef = ref(database, "users/");
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setData(
          Object.values(data).filter((e: any) => e.id !== auth.currentUser?.uid)
        );
        setValue(
          Object.values(data).filter((e: any) => e.id !== auth.currentUser?.uid)
        );
      }
    });
  }, []);
  const handleSubmit = (e: any) => {
    e.preventDefault();
  };
  const handleChange = (e: any) => {
    const FIlData =
      e.length > -1 ? value.filter((a: any) => a.username.includes(e)) : data;
    setData(FIlData);
  };
  const dispatch = useDispatch();
  return (
    <div className=" w-[350px]  bg-gray-800 text-white h-full">
      <div className="flex gap-4 mb-10 items-center">
        <AccountMenu />
        <div className="flex gap-2 mt-4 bg-white py-1 px-1 rounded-xl items-center">
          <form onSubmit={handleSubmit}>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search by username"
              onChange={(e: any) => handleChange(e.target.value)}
              inputProps={{ "aria-label": "search by username" }}
            />
            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon color="info" />
            </IconButton>
          </form>
        </div>
      </div>

      <List dense>
        {data &&
          data.map((e: any, index: number) => (
            <ListItem
              key={index}
              onClick={() => {
                dispatch(changeId(e.id));
              }}
            >
              <div className=" cursor-pointer flex gap-2 items-center">
                <ListItemAvatar>
                  <Badge
                    badgeContent={e.active ? " " : null}
                    overlap="circular"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    sx={{
                      "& .MuiBadge-badge": {
                        boxShadow: "0 6px 6px rgba(136, 255, 90, 0.2)", // Shadow qo'shish

                        backgroundColor: "rgba(0, 239, 0, 0.9)", // Rangi ochroq yashil
                      },
                    }}
                  >
                    <Avatar>{e.logo}</Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText primary={e.username} />
              </div>
            </ListItem>
          ))}
      </List>
    </div>
  );
};

export default Sidebar;
