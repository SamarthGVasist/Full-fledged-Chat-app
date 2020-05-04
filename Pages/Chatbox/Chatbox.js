

import React from 'react'
import 'react-toastify/dist/ReactToastify.css';
import './Chatbox.css'
import firebase from '../../config'
import LoginString from '../Login/LoginStrings'
import ReactLoading from 'react-loading'


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
        this.groupChatId=null
        this.removeListener=null


        this.listMessage=[]

        this.scrollToBottom=this.scrollToBottom.bind(this)
        this.currentPeerUserMessages=[];
        this.onSendMessage=this.onSendMessage.bind(this)
        this.hashString=this.hashString.bind(this)
        this.renderListMessage=this.renderListMessage.bind(this)
        this.isLastMessageLeft=this.isLastMessageLeft.bind(this)
        this.isLastMessageRight=this.isLastMessageRight.bind(this)
        console.log(this.currentPeerUser)
        firebase.firestore().collection('users').doc(this.currentPeerUser.documentKey).get().then((docRef)=>{
            this.currentPeerUserMessages=docRef.data().messages
        })



    }
        
     componentDidMount(){

        this.getListHistory()
            console.log(this.groupChatId)
        
     }
     
     
     getListHistory=()=>{
         this.listMessage.length=0
         this.setState({
             isLoading:true
         })
         if(this.hashString(this.currentUserId)<=this.hashString(this.currentPeerUser.id))
        {
            this.groupChatId=`${this.currentUserId}-${this.currentPeerUser.id}`
        }
        else
        {
            this.groupChatId=`${this.currentPeerUser.id}-${this.currentUserId}`
        }
        this.removeListener=firebase.firestore().collection('Messages').doc(this.groupChatId).collection(this.groupChatId).onSnapshot(Snapshot=>{
            Snapshot.docChanges().forEach(change=>{
                if(change.type===LoginString.DOC)
                {
                    this.listMessage.push(change.doc.data())

                    console.log(this.listMessage)
                }
            })
            this.setState({isLoading:false})
        })
        console.log(this.listMessage)
        console.log(this.listMessage.length)

     }



     componentDidUpdate(){
         this.scrollToBottom()
     }



     scrollToBottom=()=>{
         if(this.messagesEnd){
             this.messagesEnd.scrollIntoView({})
         }
     }
     
     
     componentWillReceiveProps(newProps)
     {
         console.log("ho")
         if(newProps.currentPeerUser){
             this.currentPeerUser=newProps.currentPeerUser
         }
         console.log(this.currentPeerUser)
         this.getListHistory()
         console.log(this.groupChatId)

     }

     onSendMessage=(content,type)=>{
         //console.log(this.state.inputValue)
        let notificationMessages=[]
        const timestamp=new Date().toString()
            const itemMessage={
                idFrom: this.currentUserId,
                idTo:this.currentPeerUser.id,
                timestamp:timestamp,
                content: this.state.inputValue,
                type:type
            }
            console.log(itemMessage)
           
            firebase.firestore().collection('Messages').doc(this.groupChatId).collection(this.groupChatId).doc(timestamp).set(itemMessage).then(()=>{
                this.setState({inputValue:''})
            })
            console.log("yes")
            this.currentPeerUserMessages.map((item)=>{
                if(item.notificationId!=this.currentUserId){
                    notificationMessages.push(
                        {
                            
                                notificationId:item.notificationId,
                                number: item.number
                            
                        }
                    )
                }
            })


            firebase.firestore().collection('users').doc(this.currentPeerUser.documentKey).update({
                messages: notificationMessages
            })
            .then((data)=>{})
            .catch(err=>{
                this.props.showToast(0,err.toString())
            })


     }


     renderListMessage=()=>{
        
        if(this.listMessage.length>0){
            let viewListMessage=[]
            this.listMessage.forEach((item,index)=>{
                
                if(item.idFrom===this.currentUserId)
                {
                    
                    if(item.type===0)
                    {
                        viewListMessage.push(
                            <div className="viewItemRight" key={item.timestamp}>
                                <span className="textContentItem">{item.content}</span>
                                {console.log(item.content)}
                            </div>
                        )
                    }
                }
                else{
                    if(item.type===0)
                    {
                        let d=new Date();
                        let c=d.toTimeString().slice(0,8)
                        let e=d.toDateString().slice(4)
                        let m=c+" "+e
                        let f=d.getFullYear()+'/'+d.getMonth()+'/'+d.getDate()
                        viewListMessage.push(
                            <div className="viewWrapItemLeft" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {this.isLastMessageLeft(index)?(<div></div>):(<div className="viewPaddingLeft"/>)}
                                   <div className="viewItemLeft">
                                       <span className="textContentItem">{item.content}</span>
                                   </div>
                                </div>

                                {this.isLastMessageLeft(index)?(
                                    <span className="textTimeLeft">
                                        <div className="time">{m}</div>
                                    </span>
                                ):null}
                            </div>
                        )
                    }
                }
            })
           return viewListMessage
        }
        
    }










        
        
        
    render(){
        return(
            <section>
                <span className="textHeaderChatBoard"><p>{this.currentPeerUser.name}</p></span>
                
            <div className="viewListContentChat">
            {this.renderListMessage()}
            <div 
            style={{float:'left',clear:'both'}}
            ref={el=>{
                this.messagesEnd=el
            }}/>
            
            </div>


            <input className="viewInput" placeholder="Type Message"
            value={this.state.inputValue} onChange={event=>{
                this.setState({
                    inputValue:event.target.value
                })
            }}
            
            />
            <button type="button" onClick={()=>{this.onSendMessage(this.state.inputValue,0)}}>Send</button>
            {this.state.isLoading?(<div className="viewLoading">
                <ReactLoading type={'spin'} color={'#203152'} height={'3%'} width={'3%'}/></div>):null}
                
        </section>

        
        )
    }


    hashString=str=>{
    let hash=0;
    for(let i=0;i<str.length;i++)
    {
hash+=Math.pow(str.charCodeAt(i)*31,str.length-i)
hash=hash&hash
    }
    console.log(hash)
    return hash
}


isLastMessageLeft=(index)=>{
    if
        ((index+1<this.listMessage.length && this.listMessage[index+1].idFrom===this.currentUserId)|| (index===this.listMessage.length-1))
        {
            return true
        }
        else{
            return false
        }
}


isLastMessageRight=(index)=>{
    if
        ((index+1<this.listMessage.length && this.listMessage[index+1].idFrom!==this.currentUserId)|| index===this.listMessage.length-1)
        {
            return true
        }
        else{
            return false
        }
}


}