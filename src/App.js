import React, { Component } from 'react';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo.js';
import 'tachyons';
import 'react-tilt';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';
import { join } from 'path';

const app = new Clarifai.App({
  apiKey: 'c011aa05fdba4dc1b4fcef7f579f3c67'
});

const particlesOptions = {
  particles: {
    number: {
      value: 15,
      density: {
        enable: true,
        value_area: 790
      }
    },
    color: {
      value: '#1b1e34'
    },
    shape: {
      type: 'polygon',
      stroke: {
        width: 0,
        color: '#000'
      },
      polygon: {
        nb_sides: 6
      },
      image: {
        src: 'img/github.svg',
        width: 100,
        height: 100
      }
    },
    opacity: {
      value: 0.3,
      random: true,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 75,
      random: false,
      anim: {
        enable: true,
        speed: 10,
        size_min: 40,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 200,
      color: '#bbb',
      opacity: 0.82,
      width: 0.631
    },
    move: {
      enable: true,
      speed: 10,
      direction: 'none',
      random: false,
      straight: false,
      out_mode: 'out',
      bounce: false,
      attract: {
        enable: true,
        rotateX: 600,
        rotateY: 1200
      }
    }
    }
  }


class App extends Component {
  constructor () {
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: {},
      route: 'signIn',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }
  // This app component explains what the state is of our app:
  // Meaning, our app will update only upon receiving new input, imageURL, or box info.
  // While there are packages for route, this is going to be made from scratch:
  // Route keeps track of where we are on the page/app

/*   componentDidMount() {
    fetch('http://localhost:3000')
      .then(response => response.json())
      .then(console.log)
  }

  > We no longer need this. It was just to check to see if we could talk to the server. As a result, we're going to comment this out and in the pushed app completely delete it.
  */

/*
Because componentDidMount() is a React function included in React, we don't need to use arrow functions here as it's already calling the native function.

Having .then(console.log) immediately following will put the information directly in the console.log.

This is similar to doing .then(data => console.log(data)) except we don't need to do that.
*/

loadUser = (data) => {
  const { id, name, email, entries, joined } = data;
  this.setState({user: {
    id: id,
    name: name,
    email: email,
    entries: entries,
    joined: joined
  }})
}

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('input-image');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }
  // We'll need to use a function to draw the bounding box around the faces from the coordinates given.
  // calculateFaceLocation then needs to be fed data, specifically the data for the coordinates
    // This data comes from the state of the response given from the Clarifai API
  // Therefore, we'll need to get the response by changing the function of function(response) to return its data to our calculateFaceLocation function
  // We want the same data as before, which we console logged out as a response.
    // Now that we're passing that response into calculateFaceLocation, we're able to pass that same info in. THe dot notation basically just states that each is a child of the former:
      // response: this is our returned data from the api, top-level
        // but this is wrong, we're calling data as a parameter, not response.
        // we COULD use response, but to make things clearer, and as this is technically not a response, but data being passed FROM the response gotten from an API we want to name it appropriately!
        // Instead, we'll name it data, because it's our parameter.
      // .outputs[0]: the output is in array(s) more than one if multiple faces, we just want the first
      // .data: within each array is a data object, this selects that
      // .regions[0]: a nested array, we just want the first region, so the first array (0)
      // .region_info: same as above, we're now drilling down to the property we want which is...
      // .bounding_box: the coordinates (in % Height & Width of the image) of where the face is
  // This function will grab the top_row, left_col, bottom_row, and right_col coordinates for the bounding box, as they're all properties beneath bounding_box object.
  // Because it's an arrow function, we'll call consts within, naming the return clarifaiFace
  // Then we want to do DOM manipulation so we'll create const image to to a specific id
  // We'll call the id input-image, and tag the image in FaceRecognition.js with that id
  // We use getElementById to select it. Presumably querySelectorAll() would've worked too
  // Because we're using percentages, we need to grab the height and width to do calculations on, because we need to turn the coordinates (which are in percentages of the image height/width) into pixels that we can draw.
  // Our return will need to figure out (based off the data in API) where the coordinates are in relation to the actual image in pixels based on its current height/width.
  // Here's how the properties of the math work out:
    // leftCol: clarifaiFace.left_col * width: because it comes as a default decimal percentage, to find the position in pixels you just multiply it by the pixel width or height. 0.22 x 500 returns 110, letting us know in that case that the first top-left corner is at 110px instead of a nebulous percentage. This is a column, extending down until it hits the bottomRow coordinate.
    // topRow: Same as the above, except it's a horizontal row that starts at leftCol and extends to the right until it hits the coordinates for the rightCol. We just do topRow * height to find its height in pixels.
    // rightCol: width - (clarifaiFace.rightCol * width): Since we're getting the other side of the column, we'll use the formula for the leftCol; but because that's only going to the left side, we need to essentially flip the position. How do we do that? By subtracting the result from the total pixels so that rightCol is on the right side, not the left. That way we get a position much farther away from leftCol, essentially doing clarifaiFace.leftCol * width is saying to count from the left to that position. We're doing: (clarifaiFace.rightCol * width) - width. First we're counting from the left, then taking the total width of the image and subtracting that number, which in essence flips the image because we're counting that many pixels from the right to the left.
    // bottomRow: height - (clarifaiFace.bottomRow * width): Same deal as above, but with height instead.

  displayFaceBox = (box) => {
    this.setState({box: box});
  }
/*
ES6 notation. With ES5 or before we can also do this.setState({box: box})
This sets the state of the Box object
Make sure to clean up console.log
*/

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onPictureSubmit = () => {
    this.setState({imageURL: this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
              })
        }
          this.displayFaceBox(this.calculateFaceLocation(response))
        })
        .catch(err => console.log(err));
  }
  // To clean it up, we'll use ES6 notation transforming this to an arrow function. Then we'll use .catch instead of function(err) since it's more succinct, also turning that into an arrow function.
  // response will be the location of the bounding box, which we'll need to make a class for and probably create a border tied to those locations
  // calculateFaceLocation broke as undefined for some reason when changing:
    // .then(response => this.calculateFaceLocation(response)) to:
    // .then(response => this.displayFace(calculateFaceLocation(response)))
  // Why?
    // A: Lacked this. prepending calculateFaceLocation
  // So what's going on here?
  /*
  1) When clicking the button, we're setting the state as the present state of imageURL, which pulls the image from the URL and displays it below.
  2) We then run the face detect API on the input - the url of the image.
  3) Then, on the response (again as a parameter it can be named anything) we run displayFaceBox
  4) Inside displayFaceBox is another function, calculateFaceLocation(response).
  5) So what happens is we run calculateFaceLocation using the response from .then
  6) Said data from calculateFaceLocation is placed as a parameter for displayFaceBox, essentially filling the (box) parameter with the data generated by the calculateFaceLocation function.
  7) displayFaceBox then places that information, setting the state of the box object
  */

 onRouteChange = (route) => {
   if (route === 'signOut') {
     this.setState({isSignedIn: false})
   } else if (route === 'home') {
     this.setState({isSignedIn: true})
   }
   this.setState({route: route})
 }
 // Rather than having a static 'home', we want to dynamically change where the route is pointed.
 // This means we'll need to give specific values to certain click functions, setting the state to various pages, so that we'll change things as we want.
 // We need to make sure route is the parameter for onRouteChange, and define route as the variable/parameter route. Could we change this to simply ({route})?
 /*
 > Setting another route:
We're adding another route to onRouteChange, not because we need to add them here (we add them as we go and then define below what happens based on said route), but because we want to change the State based on whether or not the user is signed in.
Calling this: isSignedIn. We initially leave it false, because you always want a user to sign in to a site unless otherwise directed.

@ (route === 'home') we'd normally want an authentication check. Initially that won't be an issue due to this being in the dev environment. IF pushing live, we'd want that in there and tested.

For Below:
As part of our clean-up exercises, we should use this.state as little as possible, as it's less performant. Instead, we want to destructure and directly call the destructured object.
Such as: instead of this.state.isSignedIn
We do: const { isSignedIn,imageURL, route, box } = this.state
at the top to destructure
Then: isSignedIn={ isSignedIn }
We do this because it's cleaner and runs better. Calling state as little as possible is preferred.
In order to do this, we destructure these objects by assigning them to a const (but it could be a let, there's just no reason to change the name, thus const)
Then we set them equal to the state, since we're changing state on them.
 */

  render() {
    const { isSignedIn, imageURL, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
        ? <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onPictureSubmit={this.onPictureSubmit}
              />
            <FaceRecognition
              imageURL={imageURL}
              box={box}
            />
          </div>
        : (
              route === 'signIn'
              ? <SignIn
                  onRouteChange={this.onRouteChange}
                  loadUser={this.loadUser}
                />
              : <Register
                  onRouteChange={this.onRouteChange}
                  loadUser={this.loadUser}
                />
          )

        }
      </div>
    );
  }
}


/*
Because it's react/JSX, we can't simply do a ternary statement with multiple changing objects.

Instead we need to wrap the else part (ternary= blah === 'condition' ? doIfTrue : doIfFalse) in a div

By wrapping it in a div, it'll return it properly, just as with any other component in react we need to return a single HTML element (a div usually) as react only returns a single element

This is because there are several components, and React can(?) only return a single component. Wrapping multiple components in a <div> fixes that, as we learned in the beginnings of React. Because what this is essentially stating is how to render the whole App, using if-else statements.
*/


export default App;


/*
> We want the user state to be an object that contains all the information the user will have associated to them on the backend, with empty strings.

> We always want empty strings when referring to state most of the time, with few exceptions because we're often changing the state to whatever that object/prop/array is. In cases like isSignedIn, we want it to default to false first.

> Ideally we'll have the user data update upon registering. We'll go back to Register now.

> Back from Register, we're building out the loadUser function in App.js so we can import and call it elsewhere in multiple components.

> We'll do the following:
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

> Because user is an object, it needs to be wrapped in {} as well as all the properties therein so it becomes ({user: {properties}}) for the correct syntax.

> Knowing how destructuring works we SHOULD be able to destructure data out of the dot notation like so:
loadUser = (data) => {
  const { id, name, email, entries, joined } = data;
  this.setState({user: {
    id: id,
    name: name,
    email: email,
    entries: entries,
    joined: joined
  }})
}

> Will return and add another comment if this doesn't work. But it seems like it should. Destructuring references the place the data comes from, assigning those values to that location so you don't repeat yourself (DRY).

<<<<< From Register.js

> We need to pass loadUser as a prop for register so that it can use it in the form. We do this by including it as a prop in the app.js where it calls the component.

> We only need to add loadUser={this.loadUser} so that it properly passes to the component.
  > This calls the loadUser into the component and allows Register.js to use loadUser as a function defined in App.js. Passing this function into any other component will allow it to be used there as well.

> Now we're going for some added functionality, cleaning a few thingsup in Server, SignIn, Rank, and App.js

> We'll change the res.json('success') to res.json(database.users[0])
  > This is to allow us to check the response of a user rather than looking to see if success was said which may or may not indicate much of anything. This is still poor to do because we aren't using a database, and we really need one.

> In SignIn.js we want to check the above response in order to routechange to Home:
  .then(response => response.json())
    .then(user => {
      if (user.id) {
        this.props.loadUser(user);
        this.props.onRouteChang('home');
      }
    })
    > This will check that we got a user.id and then will load the user appropriately, and change route to home. Then by inserting changes in Rank next, we'll be able to display the information we want from the user object specific to the person loggingin.

> Rank.js: We pass two props to Rank = ({name, entries}) => {}
    > Display them in the div using ES7 template strings:
    > {`${name}, your current rank is...`}
        <div className='white f1'>
          {entries}
        </div>
  > This will display the name of the user, as well as their entries instead of a static value we had before.
> Finally, we need to add the loadUser function as a prop into SignIn and the states of entries and name into Rank. And this is the whole (or largely thereof) reason we wanted to put this function inside App.js: so we can pass it along to our other components.

> We pass it as a prop like we've been doing:
  SignIn: loadUser={this.loadUser}
  Rank: name={this.state.name} entries={this.state.entries}
> We can't simply pass it as this.entries because both entries and name are part of the state of the app, and for that reason we need this.state. We could destructure both up above and simply put {entries} and {name} if we wanted, however.

        <--- Altering the Count by pushing user through /image Route --->

1) We're going to change the onButtonSubmit function to onPictureSubmit (as it's more descriptive)

2) Then we're going to say, if there is any response at all (meaning a face was detected) we're going to fetch the image URL endpoint with a method of PUT, then get the JSON of user.id, turn that into a string and display it.

3) While it'll update eventually, we're not getting the entries to update in real-time.

4) To do that once we get the response from the detection of a face, and we fetch the image route so that the user passes through it and their entries are incremented on the server.
  4a) We then want to do:
.then(response => response.json())
.then(count => {
  this.setState({user: {
    entries: count
  }})
})

5) This will take a response, and after there's a response it'll set the state of user.entries to count. Meaning it'll increment based on the server's function of:
 user.entries++ incrementation.

6) However, it changes the state of the entire user object, not just entries. Which then sets our name as Undefined. To fix that we're going to need something else called:

7) Object.assign()
  > We get the target object as the first parameter, in this case our (this.state.user)
  > And the second parameter is what you want to extend. In our case: {entries: count}

8) The goal of Object.assign is to assign a property of the object to change and only that property while keeping the rest unupdated.
*/