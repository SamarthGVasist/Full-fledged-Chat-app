import React from 'react'
import 'react-toastify/dist/ReactToastify.css';
import './Chatbox.css'
import firebase from '../../config'
import LoginString from '../Login/LoginStrings'

export default class Chatbox extends React.Component{
  
    constructor(props)
    {
        super(props)
        this.state={
            isLoading:false,
            isShowStiker:false,
            inputValue:''
        }
        this.currentUserName=localStorage.getItem(LoginString.Name)
        this.currentUserId=localStorage.getItem(LoginString.ID)
        this.currentUserPhoto=localStorage.getItem(LoginString.PhotoURL)
        this.currentUserDocumentId=localStorage.getItem(LoginString.FirebaseDocumentId) 
        this.stateChanged=localStorage.getItem(LoginString.UPLOAD_CHANGED)
        this.currentPeerUser=this.props.currentPeerUser
        this.myAccountMessages=[]
        this.handleClick=this.handleClick.bind(this)
    }
        
     componentDidMount(){



        
     }  
     
     
     componentWillReceiveProps(newProps)
     {
         if(newProps.currentPeerUser){
             this.currentPeerUser=newProps.currentPeerUser
         }
         console.log(this.currentPeerUser)
         this.currentMessages=[];
         if(this.currentPeerUser.messages.length>0)
         {
            this.currentMessages=[...this.currentPeerUser.messages]
         }
         





     }

     handleClick(){
         //console.log(this.state.inputValue)
        


         

         this.currentMessages.push({
             notificationId:this.currentUserId,
             msg:this.state.inputValue,
             number:0
         })
         console.log(this.currentMessages)

         this.setState({
            inputValue:''
        })


     }

        
        
        
    render(){
        return(
            <div>
                <span className="textHeaderChatBoard"><p>{this.currentPeerUser.name}</p></span>

            <div className="viewListContentChat">
           
            
            </div>


            <input className="viewInput" placeholder="Type Message"
            value={this.state.inputValue} onChange={event=>{
                this.setState({
                    inputValue:event.target.value
                })
            }}
            
            />
            <button type="button" onClick={this.handleClick}>Send</button>

        </div>

        
        )
    }
}