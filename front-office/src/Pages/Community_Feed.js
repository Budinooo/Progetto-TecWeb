import { response } from 'express';
import React, {StyleSheet} from 'react'
import {Link} from 'react-router-dom';
import Post from '../Components/Post';
import './Community_Feed.css'


class Community_Feed extends React.Component {
    constructor(props) 
    {
        super(props);
        this.state = {
            screenWidth: window.innerWidth, 
            isAdd: false,
            isPost: false,
            postChosen: 0,
            posts: []
        }
        
        this.getPosts();

        this.handleIsPost = this.handleIsPost.bind(this);
    }

    getPosts = () =>{
        fetch('/db/collection?collection=communityFeed',{
            method:'GET'
        }).then(response => response.json())
        .then(data => {
            data = data.result;
            this.setState({posts: data, isAdd:false});
        })
    }

    handleIsPost = (value, postChosen) => {
        this.setState({isPost: value, postChosen: postChosen});
    }

    setContent = () =>{
        if (this.state.isPost){
            let post = this.state.posts.filter((post) => post.id == this.state.postChosen);
            return <Post isPost={this.state.isPost} openPost={this.handleIsPost} post={post[0]}/>
        }else{
            let isPost = this.state.isPost;
            let handleIsPost = this.handleIsPost;
            return this.state.posts.map((post, i)=>{
                return <Post isPost={isPost} openPost={handleIsPost} post={post} key={i} />;
            })
        }
    }

    renderButtons = () => {
        if (this.state.isPost && !this.state.isAdd)
            return <button onClick={this.createForm}>Answer</button>
        if (this.state.isAdd){
            return <button onClick={this.sendForm}>Post</button>
        }else{
            return <button onClick={this.createForm}>Create</button>
        }   
    }

    createForm = () => {
        //controllo se utente loggato
        let login = JSON.parse(localStorage.getItem("login"))
        if (login.islogged)
            this.setState({isAdd:true});
        else
            alert("You need to login first to make a post")
    }

    sendForm = () => { //da fare con mongo 
        let login = JSON.parse(localStorage.getItem("login"))
        if(this.state.isAdd && this.state.isPost){ //send answer
            let desc = document.getElementById('description').value;
            let file = document.getElementById('upload').files;
            if (desc){
                let post = (this.state.posts.filter(obj => obj._id == this.state.postChosen))[0];
                let date = new Date();
                fetch('/db/element?id='+login.id+'&collection=users',{
                    method:'GET'
                })
                .then(response => response.json())
                .then(data => {
                    data = data.result.username;
                    let newAnswer ={
                        author: data,
                        description: desc,
                        date: date.toLocaleString(),
                        file: ''
                    }
                    if (file.length != 0)  
                        newAnswer.file = file[0];
                    post.answers.push(newAnswer);
                    let obj = {
                        collection:'communityFeed',
                        elem:{
                            "_id": post._id,
                            "author": post.author,
                            "title": post.title,
                            "description": post.description,
                            "answers": post.answers,
                            "date": post.date,
                            "file": post.file
                        }
                    }
                    fetch('/db/element',{
                        method:'PUT',
                        headers: {
                            'Content-type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(obj)
                    }).then(()=>this.getPosts())
                })
            }
        }else if(this.state.isAdd){ //send post
            let title = document.getElementById('title').value;
            let desc = document.getElementById('description').value;
            let file = document.getElementById('upload').files;
            if (title && desc){
                let date = new Date();
                fetch('/db/element?id='+login.id+'&collection=users',{
                    method:'GET'
                })
                .then(response => response.json())
                .then(data =>{
                    data = data.result.username;
                    let newPost ={
                        id: this.state.posts.length, 
                        author: data,
                        title: title,
                        description: desc,
                        answers: [],
                        date: date.toLocaleString(),
                        file: ''
                    }
                    if (file.length != 0)  
                        obj.file = file[0];
                    let obj = {
                        collection:'communityFeed',
                        elem:newPost
                    }
                    fetch('/db/element',{
                        method:'POST',
                        headers: {
                            'Content-type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(obj)
                    }).then(()=>this.getPosts())
                })
            }
        }
    }

    renderAddComment = () => {
        if (this.state.isPost && this.state.isAdd)
            return (
                <div className="add">
                    <div className={`insert ${this.state.screenWidth<500 ? "w-100" : ""}`}>
                        <label for="upload" className='w-100'> Insert image</label>
                        <input id="upload" type="file" accept="image/jpeg, image/png, image/jpg"></input>
                    </div>
                    <div className={`insert ${this.state.screenWidth<500 ? "w-100" : ""}`}>
                        <label for="description"> Insert answer</label>
                        <textarea  id="description"/>
                    </div>
                </div>)
        if (this.state.isAdd){
            return (
                <div className="add">
                    <div className={`insert ${this.state.screenWidth<500 ? "w-100" : ""}`}>
                        <label for="title"> Insert title</label>
                        <input id="title" type="text" placeholder='Title'/>
                    </div>
                    <div className={`insert ${this.state.screenWidth<500 ? "w-100" : ""}`}>
                        <label for="upload"> Insert image</label>
                        <input id="upload" type="file" accept="image/jpeg, image/png, image/jpg"></input>
                    </div>
                    <div className={`insert ${this.state.screenWidth<500 ? "w-100" : ""}`}>
                        <label for="description"> Insert description</label>
                        <textarea  id="description"/>
                    </div>
                </div>)
        }
    }

    goBack = () => {
        this.setState({isPost: false, postChosen: null});
    }

    handleResize = () =>{
        this.setState({screenWidth: window.innerWidth});
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    render() {
        return (
            <div className="container">
                <div className='titleContainer'>
                    <div className='title'>Community Feed</div>
                    {this.state.isPost ? <button onClick={this.goBack}>Back</button>: null }
                </div>
                <div className='buttons'>
                    {this.renderButtons()}    
                </div>
                {this.renderAddComment()}
                {this.setContent()}
            </div>
        )
    }
}

export default Community_Feed;