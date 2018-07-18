import React, { Component } from 'react';
import './SignIn.css';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: '',
      signInPassword: ''
    }
  }

  onEmailChange = (event) => {
    this.setState({signInEmail: event.target.value})
  }

  onPasswordChange = (event) => {
    this.setState({signInPassword: event.target.value})
  }

  onSubmitSignIn = () => {
    fetch('http://localhost:3000/signIn', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword
      })
    })
    .then(response => response.json())
    .then(user => {
      if (user.id) {
      this.props.loadUser(user);
      this.props.onRouteChange('home')
      }
    })
  }

  render() {
    const { onRouteChange } = this.props;
    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-1 mw6 shadow-5 center glass">
        <main className="pa4 black-80">
        <div className="measure">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
              <input
                className="pa2 input-reset ba bg-transparent hover-white w-100"
                type="email"
                name="email-address"
                id="email-address"
                onChange={this.onEmailChange}
              />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
              <input
                className="b pa2 input-reset ba bg-transparent hover-white w-100"
                type="password"
                name="password"
                id="password"
                onChange={this.onPasswordChange}
              />
            </div>
          </fieldset>
          <div className="">
            <input
              onClick={ this.onSubmitSignIn }
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
              type="submit"
              value="Sign in"
            />
            {/*
              We want onClick to change our Route to 'home', but by default it'll read:
              onClick={onRouteChange('home')}
              However, that'll just change state as soon as it's rendered. We want it to only respond when it's clicked, and for that we'll change it to an arrow function () => blah('')
            */}
          </div>
          <div className="lh-copy mt3">
            <p onClick={() => onRouteChange('register')}
              className="f6 link dim black db pointer">Register
            </p>
          </div>
        </div>
      </main>
    </article>
  );
  }
}

export default SignIn;

/*
  We want to keep the signin functionality within the component. Meaning we want to turn this component into a "smart" component so it has state. In this way we'll extend the class. Changing it from const SignIn to:
  class SignIn extends React.Component {
    render() {
      return ( all our previous code for the component comes here )
    }
  }
  To make this cleaner, and more in line with the rest of the app, we'll destructure { Component } from react in the imports, allowing us to simply use extends from Component instead.

  Because we changed this to a class, and we received props:
  onRouteChange() we'll need to change it.

  Remember that each time we have a class, it requires this.props before whatever our props are. So we'll go through and change all instances of onRouteChange() to this.props.onRouteChange().
    Rather: We COULD do that, or we could destructure it above as a const, which is cleaner.

  constructor() {
    super();
    this.state = {
      signInEmail: '',
      signInPassword: ''
    }
  }
  onEmailChange = (event) => {
    this.setState({signInEmail: event.target.value})
  }

  onPasswordChange = (event) => {
    this.setState({signInPassword: event.target.value})
  }

1) We'll need to add this information in just below the class.

2) We're giving the app state, needing to use a constructor
  (and of course a super() afterwards to initiate the constructor)

  2a) In order to use props (event) in onEmailChange, etc. we'll need to pass props to the constructor and super so that they pass those props down to the two states:
    signInEmail & signInPassword

3) For this to work we'll need to create a new function that takes the submit button as an event, so we can see these values. For now, we'll just console.log(this.state).

4) REMINDER: You can have multiple pieces of an app be "smart" or set their state. It retains functional coding discipline so long as said app's state is only concerned with itself. Do not reach outside the given app to set or change state elsewhere.
  4a) At the same time, it's better to have a component update its state than it is for app.js to grow considerably larger, always updating its state which is going to be heavier and take longer to loadin order to than a component which is usually quite a lot lighter.

5) Before we do the submit onclick to change the route to home, we need to change some things around.
  5a) First, we need to take the onclick routechange out of the button click.
  5b) Replace it with a call to the onSubmitSignIn() function (it's still a class so this.onSubmitSignIn())
  5c) Then add the routechange to the onSubmitSignIn() function to combine the old functionality with the new. Adding it as: this.props.onRouteChange

6) We can check this by going to the React app and signing in with the console open, we'll get an empty string for both, however, because we haven't connected the event listeners to the fields we're typing in. Let's do that now.

7) We'll add the onChange property to each of the submission boxes for email and password, appropriately referencing the onEmailChange & onPasswordChange states.
  7a) We'll also clean up the input by putting everything on its own line so it's easier to read.
  7b) Adding this.onEmailChange will update the empty string of the state with the email that was entered by the user. Same goes for the password portion.
  7c) Refresh the app, check that it's working by entering an email and password with the console open, and we'll get the email and password in an object.

8) We can now send this information to the server.

9) This can be done by adding a fetch request on the onSubmitSignIn function.
  9a) fetch('http://localhost:3000/signIn') to reference the signIn endpoint we have on the server.
  9b) By default fetch() is going to use a GET request, but we want a POST. We can change this by adding a parameter in {} with a comma after the url like so:
    fetch('http://localhost:3000', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword
      })
    }) >>> CORRECTION: headers <<<

  9c) In doing so, we define that we're getting JSON. However, we need to turn that JSON into a string so we can understand it in JS.
  9d) In Body we'll use JSON.stringify({}) with {} inside to accept an object, and the objects will be email & password with values of this.state.signInEmail & password respectively.

10) Unfortunately, something is wrong with our code: We're still getting a 404 when we should be getting a 400.
  10a) Oddly enough, we forgot to put the endpoint /signIn after the fetch request, so we were just trying to fetchon the root directory! Once that's fixed, we're getting the proper 400 error code.

11) We get response 400, error logging in. Which is the response we want when something is wrong, because that's what we defined on the server. But now we need to see WHY it's giving that response.

12) The reason was it needs to be HEADERS not HEADER

13) If we want to not allow the user to log in, and not change the route, we can add a simple .then() statement before the onRouteChange:
.then(response => response.json())
.then(data => {
  if (data === 'success') {
    this.props.onRouteChange('home')
  }
})
*/