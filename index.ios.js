/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ActivityIndicatorIOS
} = React;

var Login = require('./Login');
var AppContainer = require('./AppContainer');
var AuthService = require('./AuthService');

var GithubBrowser = React.createClass({
  //executed after render
  componentDidMount: function(){
    AuthService.getAuthInfo((err, authInfo)=> {
      this.setState({
        checkingAuth: false,
        isLoggedIn: false //authInfo != null
      })
    });
  },

  render: function() {
    if(this.state.checkingAuth){
      return (
        <View style={styles.container}>
          <ActivityIndicatorIOS
            animating={true}
            size="large"
            style={styles.loader} />
        </View>
      );
    }
    
    if(this.state.isLoggedIn){
      console.log('rendering index:isLoggedIn=true');
      return (
        <AppContainer />
      );
    } else {
      console.log('rendering index:isLoggedIn=false');
      return (
        <Login onLogin={this.onLogin} />
      );
    }
  },
  onLogin: function(){
    this.setState({isLoggedIn: true});
  },
  getInitialState: function(){
    return {
      isLoggedIn: false,
      checkingAuth: true
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('GithubBrowser', () => GithubBrowser);
