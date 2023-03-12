import React, {StyleSheet} from 'react'
import './Post.css'

class Post extends React.Component {
    constructor(props) 
    {
        super(props);
        this.isPost = props.isPost;
        this.state = {screenWidth: window.innerWidth}
    }

    setContent = () =>{
        if (this.isPost){ //post selezionato
            //console.log(this.props.post)
            return(
            <div className="postOpen container">
                <div>
                    <div className="title">{this.props.post.title}</div>
                    <div className="description">{this.props.post.description}</div>
                </div>
                {this.renderImage(this.props.post.file)}
                <div className="author">Created by <b>{this.props.post.author}</b> on <b>{this.props.post.date}</b></div>
            </div>)
        }else{            //lista di post
            return(
            <div className="postClose container">
                <div>
                    <div className="title">{this.props.post.title}</div>
                </div>
                <div className="author">Created by <b>{this.props.post.author}</b> on <b>{this.props.post.date}</b></div>
            </div>)
        }
    }

    renderImage = (file) =>{
        if (file)
            return (
                <div className='center'> 
                    {console.log(file)}
                    <img src={`${file}`} alt="image uploaded"/>
                </div>
            );
    }

    renderAnswers = () => {
        let answers = this.props.post.answers;
        if (answers.length != 0 && this.isPost){
            return answers.map((answer)=>{
                return(
                    <div key={answer.date} className={`answer ${this.state.screenWidth<500 ? "w-100" : ""}`}>
                        <div className='container'>
                            <div className="description">{answer.description}</div>
                            {this.renderImage(answer.file)}
                            <div className="author mt-auto">Created by <b>{answer.author}</b> on <b>{answer.date}</b></div>
                        </div>
                    </div>
                );
            })
        }
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
        if (this.props.post){
            return (
                <div className='postContainer'>
                    <div className={`post ${this.state.screenWidth<500 ? "w-100" : ""}`} onClick={() => this.props.openPost(true, this.props.post._id)}>
                        {this.setContent()}
                    </div>
                    {this.renderAnswers()}
                </div>
            )}
        else{
            return null
        }
    }
        
}

export default Post;