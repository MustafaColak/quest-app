import React, { useState } from "react";
import { Button, CardContent, InputAdornment, OutlinedInput } from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import { makeStyles } from "@mui/styles";
import { PostWithAuth, RefreshToken } from "../../services/HttpService";


const useStyles = makeStyles((theme) => ({
    comment: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    /*small: {
        width: theme.spacing(4,2),
        height: theme.spacing(4,2),
    },*/
    link: {
        textDecoration: "none",
        boxShadow: "none",
        color: "white"
    }
}));


function CommentForm(props) {
    const { userId, userName, postId, setCommentRefresh } = props;
    const classes = useStyles();
    const [text, setText] = useState("");

    let history = useHistory();

    const logout = () => {
        localStorage.removeItem("tokenKey")
        localStorage.removeItem("currentUser")
        localStorage.removeItem("refreshKey")
        localStorage.removeItem("userName")
        history.go(0)
    }

    const saveComment = () => {
        PostWithAuth("/comments", {
            postId: postId,
            userId: userId,
            text: text
        })
            .then((res) => {
                if (!res.ok) {
                    RefreshToken()
                        .then((res) => {
                            if (!res.ok) {
                                logout();
                            } else {
                                return dres.json()
                            }
                        })
                        .then((result) => {
                            if (result != undefined) {
                                localStorage.setItem("tokenKey", result.accessToken);
                                //localStorage.setItem("refreshKey", result.refreshToken);
                                saveComment();
                                setCommentRefresh();
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                } else {
                    res.json()
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handleSubmit = () => {
        saveComment();
        setText("");
        setCommentRefresh();
    }

    const handleChange = (value) => {
        setText(value)
    }

    return (
        <CardContent className={classes.comment}>
            <OutlinedInput
                id="outlined-dornment-amount"
                multiline
                inputProps={{ maxLength: 250 }}
                fullWidth
                onChange={(i) => handleChange(i.target.value)}
                startAdornment={
                    <InputAdornment position="start">
                        <Link className="link" to={{ pathname: '/users/' + userId }}>
                            <Avatar aria-label="recipe" className={classes.small}>
                                {userName.charAt(0).toUpperCase()}
                            </Avatar>
                        </Link>
                    </InputAdornment>
                }
                endAdornment={
                    <InputAdornment position="end">
                        <Button
                            variant="contained"
                            style={{
                                color: "white",
                                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)"
                            }}
                            onClick={handleSubmit}>
                            Comment
                        </Button>
                    </InputAdornment>
                }
                value={text}
                style={{ color: "black", backgroundColor: "white" }}
            ></OutlinedInput>
        </CardContent>
    )
}

export default CommentForm;