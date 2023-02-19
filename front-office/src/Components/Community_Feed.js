import React, {StyleSheet} from 'react'
import {Link} from 'react-router-dom';
import Post from './Post.js';
import './Navbar.css'


class Community_Feed extends React.Component {
    constructor(props) 
    {
        super(props);
        this.state = { 
            isPost: false,
            postChosen: 0
        }

        this.handleIsPost = this.handleIsPost.bind(this);
    }

    posts = [{
            'id':'0',
            'author': 'giorgio vanni',
            'title': 'Cerco rimedio per stitichezza per il mio cane',
            'description': 'Il mio cane non la fa da così tanti giorni che ogni volta che incontriamo Angelo Pintus gli chiede sempre "Hai cacato?"',
            'answers': []
        },
        {
            'id':'1',
            'author':'author',
            'title': 'title',
            'description': 'description',
            'answers': []
        }
    ]

    handleIsPost = (value, postChosen) => {
        this.setState({isPost: value, postChosen: postChosen});
    }

    setCategory = () =>{
        
    }

    setContent = () =>{
        if (this.state.isPost){
            let post = this.posts.filter((post) => post.id == this.state.postChosen);
            console.log(post)
            return <Post isPost={this.state.isPost} openPost={this.handleIsPost} post={post[0]}/>
        }else{
            let isPost = this.state.isPost;
            let handleIsPost = this.handleIsPost;
            return this.posts.map((post, i)=>{
                return <Post isPost={isPost} openPost={handleIsPost} post={post} key={i} />;
            })
        }
    }

    render() {
        return (
            <div className="container">
                {this.setContent()}
            </div>
        )
    }
}

export default Community_Feed;