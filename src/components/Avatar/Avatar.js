import React, { useState } from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { makeStyles } from "@mui/styles";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import { PutWithAuth } from "../../services/HttpService";

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
        margin: 50
    },
    modal: {
        dislay: "flex",
        maxWidth: 200,
    }
})

function Avatar(props) {
    const { avatarId , userId, userName } = props;
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(avatarId);

    const saveAvatar = () => {
        PutWithAuth("/users/" + localStorage.getItem("currentUser"), {
            avatar: selectedValue,
        })
            .then((res) => res.json())
            .catch((err) => console.log(err))
    }

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        saveAvatar();
    }

    return (
        <div>
            <Card className={classes.root}>
                <CardMedia
                    component="img"
                    alt="User Avatar"
                    //height="140"
                    image={`/avatars/avatar${selectedValue}.png`}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {userName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        User info
                    </Typography>
                </CardContent>
                <CardActions>
                    {localStorage.getItem("currentUser") == userId ? <Button size="small" onClick={handleOpen}>Change Avatar</Button> : "" }                    
                </CardActions>
            </Card>

            <Modal
                className={classes.modal}
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {[1, 2, 3, 4, 5, 6].map((value) => {
                        const labelId = `checkbox-list-secondary-label-${value}`;
                        return (
                            <ListItem
                                key={value}
                                secondaryAction={
                                    <Radio
                                        endge="end"
                                        value={value}
                                        checked={"" + selectedValue === "" + value}
                                        onChange={handleChange}
                                        name="radio-buttons"
                                        inputProps={{ 'aria-label': labelId }}
                                    />
                                }
                                disablePadding
                            >
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <CardMedia
                                            style={{ maxWidth: 100 }}
                                            component="img"
                                            alt={`Avatar n°${value}`}
                                            image={`/avatars/avatar${value}.png`}
                                            title="User Avatar"
                                        />
                                    </ListItemAvatar>
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Modal>
        </div>

    )
}

export default Avatar;