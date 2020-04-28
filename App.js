import React, {Component} from 'react';
import {Route, BrowserRouter as Router, Switch, Redirect} from 'react-router-dom'

import './App.css'

import Home from './Pages/Home/Home'
import Chat from './Pages/Chat/Chat'
import Profile from './Pages/Profile/Profile'
import SignUp from './Pages/SignUp/SignUp'
import Login from './Pages/Login/Login'
import firebase from './config'
import {toast,ToastContainer} from 'react-toastify'

class App extends Component{

      showToast=(type,message)=>{
        switch(type)
        {
          case 0:
          toast.warning(message)
          break;
          case 1:
            toast.success(message)
            break;
          default:  
              break;  
        }
      }
       
      constructor()
      {
        super();
        this.state={
          authenticated: false,
          loading: true
        };
      }  

     
      
      render(){
        return(
            (<Router>
              <ToastContainer autoclose={2000}
              hideProgressBar={true}
              position ={toast.POSITION.TOP_CENTER}/>
              <Switch>
                <Route exact path="/"
                render={props=><Home {...props}/>}/>
              <Route

              path="/login"
              render ={props=><Login showToast={this.showToast}{...props}/>}
              />


              <Route

              path="/profile"
              render ={props=><Profile showToast={this.showToast}{...props}/>}

              />

              <Route

              path="/signup"
              render ={props=><SignUp showToast={this.showToast}{...props}/>}

              />

              <Route

              path="/chat"
              render ={props=><Chat showToast={this.showToast}{...props}/>}

              />


              </Switch>
            </Router>)

          
        )
      }
    }








      


export default App