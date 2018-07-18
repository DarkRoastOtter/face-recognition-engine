import React, { Component } from 'react';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: ''
    }
  }

  onNameChange = (event) => {
    this.setState({name: event.target.value})
  }

  onEmailChange = (event) => {
    this.setState({email: event.target.value})
  }

  onPasswordChange = (event) => {
    this.setState({password: event.target.value})
  }

  onSubmitRegister = () => {
    fetch('http://localhost:3000/Registration', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(response => response.json())
      .then(user => {
        if (user) {
        this.props.loadUser(user);
        this.props.onRouteChange('home')
        }
      })
  }

  render() {
    return (
        <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-1 mw6 shadow-5 center glass">
          <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Register</legend>
              <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
              <input
                className="pa2 input-reset ba bg-transparent hover-white w-100"
                type="text"
                name="name"
                id="name"
                onChange={this.onNameChange}
              />
            </div>
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
                onClick={this.onSubmitRegister}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Register"
              />
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default Register;

/*
<Form> is usually used with HTML to send an AJAX request to submit the form.
However, since we're going to be using JSON ( a far more useful and customizeable approach ) we can change the <form> tag to a <div> to avoid any console errors.

1) Just like with SignIn we'll convert Register to a class, extend it out, and add constructors. Reference the comments in SignIn for further information.

2) Referencing SignIn we'll do much of the same, adding onChange={} to the inputs, tying them to the state, and we'll add a name as well for a total of three states.

3) Additionally, we'll want to add a onSubmitRegistration, but we can copy the function from SignIn, changing what's appropriate.

4) It'll still be a POST request, because we're adding a brand new user to the database.
  4a) Copying all this code and reusing it is considered a bad idea, something we can improve upon later and clean up as it were. But for now it'll help to illustrate a point.

5) We can actually delete the onRouteChange destructuring as React is telling us it's not needed. Not sure why, when SignIn seems to need it still. Handy reminder to check out the terminal.

6) We want to be able to go to home once we're registered, but our server returns the last user (the current user). This data will be the user.

7) So we change the .then(data => { if (data === 'success') {routechangehere} })
  To: .then(user => { if (user) {routechangehere} })

> Because the backend returns the last user registered (the current user that's registering) we want to make sure that when the backend/server returns a user (registration success) that we change the route to 'home'

> But we also want to be able to update the user's profile on the frontend.

> Since there isn't a user profile on the frontend yet, we'll need to add it as a state.

<<<< Back from App.js

> Now that we've created that on App.js we want to update the user when registering, so we'll add a function on top of the routechange called loadUser. But, because we might want to use this in other sections and not just this specific component we'll build it out in app.js and import it.

<<<< Back from App.js

> Upon submit button we're now loading the user that got submitted, and signing into home.

> We'll need to test the code to be sure.
  > It fails, because loadUser is not considered a function because it's not been passed into register as a prop. We need to go back and do that.

>>>>> Go to App.js

<<<<< Back from App.js

> For some reason we're getting an Unhandled Rejection (SyntaxError): Unexpected token < in JSON at position 0
  > This is on line 35 referring to:
.then(response => response.json())

> Nothing was wrong with that line in specific. The problem was the ENDPOINT was /Registration and our Frontend was pointing at another endpoint /Register instead. Fixing that, fixed the error.

*/