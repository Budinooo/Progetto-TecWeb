import React, {StyleSheet} from 'react'
import {Link} from 'react-router-dom';
import './Leaderboard.css'


class Leaderboard extends React.Component {
    constructor(props) 
    {
        super(props);
        this.state = {users: [
            {
                username: 'bob',
                score: 200
            },
            {
                username: 'tod',
                score: 100
            },
            {
                username: 'rob',
                score: 10
            }
        ]}
    }

    renderUsers = () => {
        let users = this.state.users;
        return users.map((user, i)=>{
            return(
                <div className="userlb">
                    <div className='ranklbContainer'>
                        <div id={`rank${i+1}`} className='ranklb'> {i+1} </div>
                    </div>
                    <div className='scorelbContainer'>
                        <div className='scorelb'>{user.score}</div>
                        <div className='usernamelb'>{user.username}</div>
                    </div>
                </div>
            );
        })
    }

    setRankingsColor = () =>{
        if(document.getElementById('rank1'))
            document.getElementById('rank1').style.backgroundColor = "gold";
        if(document.getElementById('rank2'))
            document.getElementById('rank2').style.backgroundColor = "silver";
        if(document.getElementById('rank3'))
            document.getElementById('rank3').style.backgroundColor = "#CD7F32";
    }

    componentDidMount() {
       this.setRankingsColor() 
    }  

    render() {
        return (
            <div className='leaderboard'>
                <div className='titlelbContainer'>
                    <div className='titlelb'>
                        LEADERBOARD
                    </div>
                </div>
                <div className='userslbContainer'>
                    {this.renderUsers()}
                </div>
            </div>
        )}
}

export default Leaderboard;