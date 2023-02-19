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
            posts: [
                {
                    id:'0',
                    author: 'giorgio vanni',
                    title: 'Cerco rimedio per stitichezza per il mio cane',
                    description: 'Il mio cane non la fa da così tanti giorni che ogni volta che incontriamo Angelo Pintus gli chiede sempre "Hai cacato?"',
                    answers: [
                        {
                            author:'Amazon',
                            description:'https://www.amazon.it/Enterogermina-integratore-alimentare-intestinale-lequilibrio/dp/B07V8TYV98/ref=asc_df_B07V8TYV98/?tag=googshopit-21&linkCode=df0&hvadid=407944040807&hvpos=&hvnetw=g&hvrand=13469476729332512721&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=1008141&hvtargid=pla-852835221768&psc=1&tag=&ref=&adgrpid=86164770143&hvpone=&hvptwo=&hvadid=407944040807&hvpos=&hvnetw=g&hvrand=13469476729332512721&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=1008141&hvtargid=pla-852835221768',
                            date:'12/12/12, 12:12:13',
                            file: ''
                        },
                        {
                            author:'Ebay',
                            description:'Non fidarti di lui, prova questo https://www.ebay.it/itm/334495836273?mkevt=1&mkcid=1&mkrid=724-53478-19255-0&campid=5338748322&toolid=20006&customid=lyw8ozUVAAAAzj_HIslmY1EwmaYXAAAAAA',
                            date:'12/12/12, 12:12:14',
                            file: ''
                        }
                    ],
                    date:'12/12/12, 12:12:12',
                    file: ''
                },
                {
                    id:'1',
                    author:'author',
                    title: 'title',
                    description: 'description',
                    answers: [],
                    date:'11/11/11, 11:11:11',
                    file: ''
                }
            ]
        }

        this.handleIsPost = this.handleIsPost.bind(this);
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
        this.setState({isAdd:true});
    }

    sendForm = () => { //da fare con mongo 
        if(this.state.isAdd && this.state.isPost){ //send answer
            let desc = document.getElementById('description').value;
            let file = document.getElementById('upload').files;
            if (desc){
                let post = (this.state.posts.filter(obj => obj.id == this.state.postChosen))[0];
                let posts = this.state.posts;
                let date = new Date();
                let obj ={
                    author: 'giorgio vanni',
                    description: desc,
                    date: date.toLocaleString(),
                    file: ''
                }
                if (file.length != 0)  
                    obj.file = file[0];
                post.answers.push(obj);
                posts[this.state.postChosen].answers = post.answers;
                this.setState({posts:posts, isAdd:false});
            }
        }else if(this.state.isAdd){ //send post
            let title = document.getElementById('title').value;
            let desc = document.getElementById('description').value;
            let file = document.getElementById('upload').files;
            if (title && desc){
                let date = new Date();
                let obj ={
                    id: this.state.posts.length, 
                    author: 'giorgio vanni',
                    title: title,
                    description: desc,
                    answers: [],
                    date: date.toLocaleString(),
                    file: ''
                }
                if (file.length != 0)  
                    obj.file = file[0];
                let posts = this.state.posts;
                posts.push(obj);
                this.setState({posts:posts, isAdd:false});
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