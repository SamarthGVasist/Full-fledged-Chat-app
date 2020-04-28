import React from 'react'
import LoginString from '../Login/LoginStrings';
import firebase from '../../config'
import './Chat.css'
import ReactLoading from 'react-loading'
import WelcomeBoard from '../Welcome/Welcome'
import ChatBox from '../Chatbox/Chatbox'

class Chat extends React.Component{
    constructor(props){
        super(props)
        this.state={
            isLoading:true,
            isOpenDialogConfirmLogout: false,
            currentPeerUser:null,
            displayedContactSwitchedNotification:[],
            displayedContacts:[]
        }
        this.currentUserName=localStorage.getItem("nickame")
        this.currentUserId=localStorage.getItem(LoginString.ID)
        this.currentUserPhoto=localStorage.getItem(LoginString.PhotoURL)
        this.currentUserDocumentId=localStorage.getItem(LoginString.FirebaseDocumentId) 
        this.currentUserMessages=[]  
        this.handleLog=this.handleLog.bind(this)
        this.notificationMessagesErase=[]
 
        this.onProfileClick=this.onProfileClick.bind(this)
        this.getListUser=this.getListUser.bind(this)
            this.searchUsers=[]
            this.renderListUser=this.renderListUser.bind(this)
            this.getClassnameforUserandNotification=this.getClassnameforUserandNotification.bind(this)
            this.notificationErase=this.notificationErase.bind(this)
            this.updaterenderList=this.updaterenderList.bind(this)
    }

onProfileClick=()=>{
    this.props.history.push('/profile')
}


      
  handleLog() {
    firebase.auth().signOut();
    this.props.history.push('/')
    localStorage.clear()
  }


  componentDidMount(){
        firebase.firestore().collection('users').doc(this.currentUserDocumentId).get().then((doc)=>{
            doc.data().messages.map((item)=>{this.currentUserMessages.push({notificationId: item.notificationId,
                number:item.number,msg:item.msg
            })
        })
        this.setState({
            displayedContactSwitchedNotification: this.currentUserMessages
        })
        this.getListUser()
    
        })
  }



  getListUser=async()=>{
      const result=await firebase.firestore().collection('users').get();
      if(result.docs.length>0)
      {
          let listUsers=[]
          listUsers=[...result.docs]
          listUsers.forEach((item,index)=>{
              this.searchUsers.push(
                  {
                      key:index,
                      documentKey:item.id,
                      id:item.data().id,
                      name:item.data().name,
                      messages:item.data().messages,
                      URL:item.data().URL,
                      description:item.data().description
                  }
              )
          })
          this.setState({
              isLoading:false
          })
        }
        this.renderListUser()

      }

      getClassnameforUserandNotification=(itemId)=>{
          let number=0;
          let className=""
          let check=false;
          if(this.state.currentPeerUser && this.state.currentPeerUser.id===itemId){
              className='viewWrapItemFocused'
          }
          else
          {
              this.state.displayedContactSwitchedNotification.forEach((item)=>{
                  if(item.notificationId.length>0)
                  {
                      if(item.notificationId===itemId){
                          check=true
                          number=item.number
                      }
                  }
              })
              if(check===true){
                className="viewWrapItemNotification"
          }
          else{
              className='viewWrapItem'
          }

      }
      return className
    }

    notificationErase=(itemId)=>{
        this.state.displayedContactSwitchedNotification.forEach((el)=>{
            if(el.notificationId>0)
            {
                if(el.notificationId!=itemId){
                        this.notificationMessagesErase.push(
                           { notificationId: el.notificationId,
                            number: el.number,
                            msg:el.msg
                        }
                        )
                }
            }
        })
        this.updaterenderList()
    }
    updaterenderList=()=>{
        firebase.firestore().collection('users').doc(this.currentUserDocumentId).update({
            messages:this.notificationMessagesErase
        })
        this.setState({
            displayedContactSwitchedNotification:this.notificationMessagesErase
        })
    }






     renderListUser=()=>{

        if(this.searchUsers.length>0){
            let viewListUser=[]
            let classname=""
            this.searchUsers.map((item)=>{
                if(item.id!=this.currentUserId){
                    classname=this.getClassnameforUserandNotification(item.id)
                    viewListUser.push(<button id={item.key} className={classname} onClick={()=>{
                        this.notificationErase(item.id)
                        this.setState({currentPeerUser:item})
                        document.getElementById(item.key).style.backgroundColor='#fff'
                        document.getElementById(item.key).style.color='#fff'
                    }}>

                        <img className="viewAvatarItem"
                        src={item.URL}
                        alt=""
                        placeholder=""/>
                        <div className="viewWrapContentItem">
                            <span className="textItem">
                                {`${item.name}`}
                            </span>
                        </div>
                        {classname==='viewWrapItemNotification'?
                        <div className="notificationparagraph">
                            <p id={item.id} className="newmessages">New messages</p>
                        </div>:null}


                    </button>)
                }
            })
            this.setState({
                displayedContacts:viewListUser
            })

        }else{
            console.log("No user is present")
        }
     } 
  


    
    render(){
        return(
            <div className="root">
                <div className="body">
                    <div className="viewListUser">
                        <div className="profileviewleftside">
                            <img 
                            className="ProfilePicture"
                            alt=""
                            src={this.currentUserPhoto}
                            onClick={this.onProfileClick}/>
                            <button className="Logout" onClick={this.handleLog}>LogOut</button>
                            
                        </div>
                        {this.state.displayedContacts}
                    </div>
                    <div className="viewBoard">
                        {this.state.currentPeerUser?(<ChatBox currentPeerUser={this.state.currentPeerUser}
                        showToast={this.props.showToast}/>):(<WelcomeBoard currentUserName={this.currentUserName}/>)}
                    </div>
                </div>
            </div>


        )
    }
}

export default Chat;















