import React, { useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Post from "../Post/Post";
import { GetWithAuth } from "../../services/HttpService";


const columns = [
    {
        id: 'User Activity',
        label: 'User Activity',
        minWidth: 170,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
];

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Popup(props) {
    const { isOpen, postId, setIsOpen } = props;
    const [open, setOpen] = React.useState(false);
    const [post, setPost] = useState(null);

    const getPost = () => {
        GetWithAuth("/posts/" + postId)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    setPost(result);
                },
                (error) => {
                    console.log(error)
                }
            )
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setIsOpen(false);
    };

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        getPost();
    }, [postId]);

    return (
        post != null ?
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Close
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Post likes={post.postLikes} postId={post.id} userId={post.userId} userName={post.userName}
                    title={post.title} text={post.text}></Post>
            </Dialog> : "loading"
    )
}


function UserActivity(props) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [rows, setRows] = useState([]);
    const { userId } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const handleNotification = (postId) => {
        setSelectedPost(postId);
        setIsOpen(true);
    };

    const getActivity = () => {
        GetWithAuth("activity/" + userId)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    console.log(result);
                    setRows(result);
                },
                (error) => {
                    console.log(error);
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    useEffect(() => {
        getActivity()
    }, [])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div>
            {isOpen ? <Popup isOpen={isOpen} postId={selectedPost} setIsOpen={setIsOpen} /> : ""}
            <Paper sx={{ width: '100%', overflow: 'hidden' , marginTop: 6}}>
                <TableContainer sx={{ maxHeight: 440, minWidth: 100, maxWidth: 800 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                User Activity
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                                .map((row) => {
                                    return (
                                        <Button onClick={() => handleNotification(row[1])}>
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                <TableCell align="right">
                                                    {row[3] + " " + row[0] + " your post"}
                                                </TableCell>
                                            </TableRow>
                                        </Button>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    )
}

export default UserActivity;