import React, {StyleSheet} from 'react'
import {Link} from 'react-router-dom';
import './Post.css'


class Post extends React.Component {
    constructor(props) 
    {
        super(props);
        this.isPost = props.isPost;
        
    }

    setContent = () =>{
        if (this.isPost){ //post selezionato
            return(
            <div className="postOpen">
                <div className="author">{this.props.post.author}</div>
                <div className="title">{this.props.post.title}</div>
                <div className="description">{this.props.post.description}</div>
            </div>)
        }else{            //lista di post
            return(
            <div className="postOpen">
                <div className="author">{this.props.post.author}</div>
                <div className="title">{this.props.post.title}</div>
            </div>)
        }
    }

    render() {
    return (
        <div className="container post" onClick={() => this.props.openPost(true, this.props.post.id)}>
            {this.setContent()}
        </div>
    )}
}

export default Post;